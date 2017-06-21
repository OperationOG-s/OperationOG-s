using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using PortableRecipes;
using PortableRecipes.Models;
using PortableRecipes.Filters;
using System.IO;


  [Route("api/v1/User")]
  public class UserApiController : Controller
  {
    private readonly MailOptions _mailOptions;
    public readonly PortableRecipesContext _context;

    public UserApiController(PortableRecipesContext context, IOptions<MailOptions> mailOptionsAccessor)
    {
      _context = context;
      _mailOptions = mailOptionsAccessor.Value;
    }

    public bool ApiTokenValid => RestrictToUserTypeAttribute.ApiToken != null &&
        HttpContext.Request.Headers["ApiToken"] == RestrictToUserTypeAttribute.ApiToken;

    
    [HttpPost("Validate")]
    [ValidateAntiForgeryToken]
    public bool Validate([FromBody] RegistrationData registration_data)
    {
      string username = registration_data.Username,
             email = registration_data.Email,
             email_confirmation = registration_data.EmailConfirmation;
      if (username != null && username != "" && email != null && email != "" && email == email_confirmation) {
        return !_context.User.Any(t => t.Username == username || t.Email == email);
      }
      return false;
    }

    [HttpPost("Register")]
    [ValidateAntiForgeryToken]
    public UserViewData Register([FromBody] RegistrationData registration_data)
    {
      string username = registration_data.Username,
             email = registration_data.Email,
             email_confirmation = registration_data.EmailConfirmation;
      if (username != null && username != "" && email != null && email != "" && email == email_confirmation) {
        var item = _context.User.FirstOrDefault(t => t.Username == username || t.Email == email);
        if (item == null) {
          var new_password_text = PasswordHasher.RandomPassword;
          var new_password = PasswordHasher.Hash(new_password_text);
          item = new User() { Username = username, Email = email, PasswordHash = new_password.PasswordHash, PasswordSalt = new_password.PasswordSalt };
          var apiKey = StaticMailer._mailOptions.MailApiToken;
          var client = new SendGridClient(apiKey);
          var from = new EmailAddress(StaticMailer._mailOptions.MailFrom);
          var subject = "User account created with temporary password.";
          var to = new EmailAddress(item.Email);
          var plainTextContent = $"Your User temporary password has set. Your username and password combination is \n\nUsername: {item.Username}\nPassword: {new_password_text}\n";
          var htmlContent = $"Your User temporary password has set. Your username and password combination is <br />Username: {item.Username}<br />Password: {new_password_text}<br />";
          var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
          var response = client.SendEmailAsync(msg).Result;
          
          _context.User.Add(item);
          _context.SaveChanges();

          return UserViewData.FromUser(item);
        }
      }
      throw new Exception("Cannot register.");
    }
    

    [HttpPost("Login")]
    [ValidateAntiForgeryToken]
    public UserViewData Login([FromBody] LoginData login_data)
    {
      var item = _context.User.FirstOrDefault(t => t.Username == login_data.Username || t.Email == login_data.Email);
      if (item != null && login_data.Password != null) {
        if (PasswordHasher.CheckHash(login_data.Password, new PasswordAndSalt(){ PasswordHash = item.PasswordHash, PasswordSalt = item.PasswordSalt })) {
          HttpContext.Login<LoggableEntities>(_context, new LoggableEntities() { User = item });

          return UserViewData.FromUser(item);
        }
      }
      throw new Exception("Cannot login.");
    }

    [HttpPost("Logout")]
    [ValidateAntiForgeryToken]
    public IActionResult Logout()
    {
      HttpContext.Logout(_context);
      return Ok();
    }

    [HttpPost("ChangePassword")]
    [ValidateAntiForgeryToken]
    public IActionResult ChangePassword([FromBody] ChangePasswordData change_password_data)
    {
      var item = _context.User.FirstOrDefault(t => t.Username == change_password_data.Username);
      var session = HttpContext.Get<LoggableEntities>(_context);
      if (item != null && session.User != null &&
          session.User.Id == item.Id &&
          change_password_data.Username != null && change_password_data.Password != null &&
          change_password_data.NewPassword != null && change_password_data.NewPasswordConfirmation != null) {
        if (change_password_data.NewPassword == change_password_data.NewPasswordConfirmation && PasswordHasher.CheckHash(change_password_data.Password, new PasswordAndSalt(){ PasswordHash = item.PasswordHash, PasswordSalt = item.PasswordSalt })) {
          var new_password = PasswordHasher.Hash(change_password_data.NewPassword);
          item.PasswordHash = new_password.PasswordHash;
          item.PasswordSalt = new_password.PasswordSalt;
          _context.User.Update(item);
          _context.SaveChanges();

          HttpContext.Login<LoggableEntities>(_context, new LoggableEntities() { User = item });

          return Ok();
        }
      }
      throw new Exception("Cannot change password.");
    }

    [HttpPost("ResetPassword")]
    [ValidateAntiForgeryToken]
    public IActionResult ResetPassword([FromBody] ResetPasswordData reset_password_data)
    {
      var item = _context.User.FirstOrDefault(t => t.Username == reset_password_data.Username || t.Email == reset_password_data.Email);
      if (item != null && (reset_password_data.Username != null || reset_password_data.Email != null)) {
        var new_password_text = PasswordHasher.RandomPassword;
        var apiKey = StaticMailer._mailOptions.MailApiToken;
        var client = new SendGridClient(apiKey);
        var from = new EmailAddress(StaticMailer._mailOptions.MailFrom);
        var subject = "User password reset request.";
        var to = new EmailAddress(item.Email);
        var plainTextContent = $"Your User password has been reset. Your new username and password combination is \n\nUsername: {item.Username}\nPassword: {new_password_text}\n";
        var htmlContent = $"Your User password has been reset. Your new username and password combination is <br />Username: {item.Username}<br />Password: {new_password_text}<br />";
        var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
        var response = client.SendEmailAsync(msg).Result;

        var new_password = PasswordHasher.Hash(new_password_text);
        item.PasswordHash = new_password.PasswordHash;
        item.PasswordSalt = new_password.PasswordSalt;
        _context.User.Update(item);
        _context.SaveChanges();

        // HttpContext.Logout(_context);

        return Ok();
      }
      throw new Exception("Cannot reset password.");
    }
    [RestrictToUserType(new string[] {"Admin", "User"})]
    [HttpGet("{id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public ItemWithEditable<UserViewData> GetById(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.User : _context.User;
      var editable_items = ApiTokenValid ? _context.User : current_Admin != null || current_User != null ? (current_User != null ? (from _User in _context.User where _User.Id == current_User.Id
select _User) : _context.User) : Enumerable.Empty<User>().AsQueryable();
      var item = PortableRecipes.Models.User.FilterViewableAttributesLocal(current_User, current_Admin)(allowed_items.FirstOrDefault(e => e.Id == id));
      item = PortableRecipes.Models.User.WithoutImages(item);
      return new ItemWithEditable<UserViewData>() {
        Item = UserViewData.FromUser(item),
        Editable = editable_items.Any(e => e.Id == item.Id) };
    }
    

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public UserViewData Create()
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      if (_context.User.Any(u => u.Username == null || u.Email == null || u.Username == "" || u.Email == ""))
        throw new Exception("Unauthorized create attempt");
      var can_create_by_token = ApiTokenValid || true;
      if (!can_create_by_token)
        throw new Exception("Unauthorized create attempt");
      var item = new User() { CreatedDate = DateTime.Now, Id = _context.User.Max(i => i.Id) + 1 };
      _context.User.Add(PortableRecipes.Models.User.FilterViewableAttributesLocal(current_User, current_Admin)(item));
      _context.SaveChanges();
      item = PortableRecipes.Models.User.WithoutImages(item);
      return UserViewData.FromUser(item);
    }

    [RestrictToUserType(new string[] {"Admin", "User"})]
    [HttpPut]
    [ValidateAntiForgeryToken]
    public void Update([FromBody] UserViewData item)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.User : (current_User != null ? (from _User in _context.User where _User.Id == current_User.Id
select _User) : _context.User);
      if (!allowed_items.Any(i => i.Id == item.Id)) return;
      var new_item = UserViewData.FromUserViewData(item, _context);
      if (current_User != null && new_item.Id == current_User.Id)
           HttpContext.Set<LoggableEntities>(_context, new LoggableEntities() { User = new_item });
      var can_edit_by_token = ApiTokenValid || true;
      if (item == null || !can_edit_by_token)
        throw new Exception("Unauthorized edit attempt");
      _context.Update(new_item);
      _context.Entry(new_item).Property(x => x.Username).IsModified = false;
      _context.Entry(new_item).Property(x => x.Email).IsModified = false;
      _context.Entry(new_item).Property(x => x.CreatedDate).IsModified = false;
      _context.SaveChanges();
    }

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpDelete("{id}")]
    [ValidateAntiForgeryToken]
    public void Delete(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.User : _context.User;
      var item = _context.User.FirstOrDefault(e => e.Id == id);
      var can_delete_by_token = ApiTokenValid || true;
      if (item == null || !can_delete_by_token)
        throw new Exception("Unauthorized delete attempt");
      
      if (!allowed_items.Any(a => a.Id == item.Id)) throw new Exception("Unauthorized delete attempt");
      
      _context.User.Remove(item);
      _context.SaveChanges();
    }

    [RestrictToUserType(new string[] {"Admin", "User"})]
    [HttpGet]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<UserViewData> GetAll([FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.User : _context.User;
      var editable_items = ApiTokenValid ? _context.User : current_Admin != null || current_User != null ? (current_User != null ? (from _User in _context.User where _User.Id == current_User.Id
select _User) : _context.User) : Enumerable.Empty<User>().AsQueryable();
      var can_edit_by_token = ApiTokenValid || true;
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true;
      return allowed_items
        .Select(PortableRecipes.Models.User.FilterViewableAttributes(current_User, current_Admin))
        .Select(s => Tuple.Create(s, can_edit_by_token && editable_items.Any(es => es.Id == s.Id)))
        .Paginate(can_create_by_token, can_delete_by_token, false, page_index, page_size, PortableRecipes.Models.User.WithoutImages, item => UserViewData.FromUser(item));
    }

    


    
  }

  