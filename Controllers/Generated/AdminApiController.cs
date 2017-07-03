using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using PortableRecipes;
using PortableRecipes.Models;
using PortableRecipes.Filters;
using System.IO;


  [Route("api/v1/Admin")]
  public class AdminApiController : Controller
  {
    private readonly MailOptions _mailOptions;
    public readonly PortableRecipesContext _context;
    private IHostingEnvironment env;

    public AdminApiController(PortableRecipesContext context, IHostingEnvironment env, IOptions<MailOptions> mailOptionsAccessor)
    {
      _context = context;
      _mailOptions = mailOptionsAccessor.Value;
      this.env = env;
    }

    public bool ApiTokenValid => RestrictToUserTypeAttribute.ApiToken != null &&
        HttpContext.Request.Headers["ApiToken"] == RestrictToUserTypeAttribute.ApiToken;

    
    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPost("DeleteSessions")]
    [ValidateAntiForgeryToken]
    public IActionResult DeleteSessions() {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      if (session.Admin != null) {
        var item = _context.Admin.FirstOrDefault(t => t.Id == session.Admin.Id);
        if (item != null) {
          var allowed_items = ApiTokenValid ? _context.Admin : _context.Admin;
          if (!allowed_items.Any(i => i.Id == item.Id)) return Unauthorized();
          HttpContext.Deleted<Admin>(_context, "Admin", item);
          return Ok();
        }
      }
      return Unauthorized();
    }

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPost("ActiveSessions")]
    [ValidateAntiForgeryToken]
    public IActionResult GetActiveSessions() {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      if (session.Admin != null) {
        var item = _context.Admin.FirstOrDefault(t => t.Id == session.Admin.Id);
        if (item != null) {
          var allowed_items = ApiTokenValid ? _context.Admin : _context.Admin;
          if (!allowed_items.Any(i => i.Id == item.Id)) return Unauthorized();
          return Ok(_context.Session.Where(s => s.LoggedEntityId == item.Id)
            .Select(s => Tuple.Create(s.AdditionalInfo, s.CreatedAt))
            .ToArray());
        }
      }
      return Unauthorized();
    }

    [HttpPost("Validate")]
    [ValidateAntiForgeryToken]
    public bool Validate([FromBody] RegistrationData registration_data)
    {
      string username = registration_data.Username,
             email = registration_data.Email,
             email_confirmation = registration_data.EmailConfirmation;
      if (username != null && username != "" && email != null && email != "" && email == email_confirmation) {
        return !_context.Admin.Any(t => t.Username == username || t.Email == email);
      }
      return false;
    }

    [HttpPost("Register")]
    [ValidateAntiForgeryToken]
    public AdminViewData Register([FromBody] RegistrationData registration_data)
    {
      string username = registration_data.Username,
             email = registration_data.Email,
             email_confirmation = registration_data.EmailConfirmation;
      if (username != null && username != "" && email != null && email != "" && email == email_confirmation) {
        var item = _context.Admin.FirstOrDefault(t => t.Username == username || t.Email == email);
        if (item == null) {
          var new_password_text = PasswordHasher.RandomPassword;
          var new_password = PasswordHasher.Hash(new_password_text);
          item = new Admin() { Id = _context.Admin.Max(i => i.Id) + 1, Username = username, Email = email, PasswordHash = new_password.PasswordHash, PasswordSalt = new_password.PasswordSalt };
          var apiKey = StaticMailer._mailOptions.MailApiToken;
          var client = new SendGridClient(apiKey);
          var from = new EmailAddress(StaticMailer._mailOptions.MailFrom);
          var subject = "Admin account created with temporary password.";
          var to = new EmailAddress(item.Email);
          var plainTextContent = $"Your Admin temporary password has set. Your username and password combination is \n\nUsername: {item.Username}\nPassword: {new_password_text}\n";
          var htmlContent = $"Your Admin temporary password has set. Your username and password combination is <br />Username: {item.Username}<br />Password: {new_password_text}<br />";
          var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
          var response = client.SendEmailAsync(msg).Result;
          
          _context.Admin.Add(item);
          _context.SaveChanges();

          return AdminViewData.FromAdmin(item);
        }
      }
      throw new Exception("Cannot register.");
    }

    [HttpPost("Login")]
    [ValidateAntiForgeryToken]
    public IActionResult /*AdminViewData*/ Login([FromBody] LoginData login_data)
    {
      var item = _context.Admin.FirstOrDefault(t => t.Username == login_data.Username || t.Email == login_data.Email);
      if (item != null) {
        var last_login_attempt = item.LastLoginAttempt;
        item.LastLoginAttempt = DateTime.Now;
        _context.Update(item);
        _context.SaveChanges();
        if (login_data.Password != null && (last_login_attempt != null || (DateTime.Now - last_login_attempt).TotalSeconds > 3)) {
          if (PasswordHasher.CheckHash(login_data.Password, new PasswordAndSalt(){ PasswordHash = item.PasswordHash, PasswordSalt = item.PasswordSalt })) {
            HttpContext.Login<LoggableEntities, Admin>(env, _context, "Admin", item, new LoggableEntities() { Admin = item });

            return Ok(AdminViewData.FromAdmin(item));
          }
        }
      }
      return Unauthorized();
    }

    [HttpPost("Logout")]
    [ValidateAntiForgeryToken]
    public IActionResult Logout()
    {
      HttpContext.Logout(_context);
      return Ok();
    }

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPost("ChangePassword")]
    [ValidateAntiForgeryToken]
    public IActionResult ChangePassword([FromBody] ChangePasswordData change_password_data)
    {
      var item = _context.Admin.FirstOrDefault(t => t.Username == change_password_data.Username);
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      if (item != null &&
          change_password_data.Username != null && change_password_data.Password != null &&
          change_password_data.NewPassword != null && change_password_data.NewPasswordConfirmation != null) {
        var allowed_items = ApiTokenValid ? _context.Admin : _context.Admin;
        if (!allowed_items.Any(i => i.Id == item.Id)) return Unauthorized();
        if (change_password_data.NewPassword == change_password_data.NewPasswordConfirmation && PasswordHasher.CheckHash(change_password_data.Password, new PasswordAndSalt(){ PasswordHash = item.PasswordHash, PasswordSalt = item.PasswordSalt })) {
          var new_password = PasswordHasher.Hash(change_password_data.NewPassword);
          item.PasswordHash = new_password.PasswordHash;
          item.PasswordSalt = new_password.PasswordSalt;
          _context.Admin.Update(item);
          _context.SaveChanges();

          HttpContext.ChangedPassword<Admin>(_context, "Admin", item);
          // HttpContext.Login<LoggableEntities, Admin>(_context, "Admin", item, new LoggableEntities() { Admin = item });

          return Ok();
        }
      }
      return Unauthorized();
    }

    [HttpPost("ResetPassword")]
    [ValidateAntiForgeryToken]
    public IActionResult ResetPassword([FromBody] ResetPasswordData reset_password_data)
    {
      var item = _context.Admin.FirstOrDefault(t => t.Username == reset_password_data.Username || t.Email == reset_password_data.Email);
      if (item != null && (reset_password_data.Username != null || reset_password_data.Email != null)) {
        var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
        var allowed_items = ApiTokenValid ? _context.Admin : _context.Admin;
        if (!allowed_items.Any(i => i.Id == item.Id)) return Unauthorized();

        var new_password_text = PasswordHasher.RandomPassword;
        var apiKey = StaticMailer._mailOptions.MailApiToken;
        var client = new SendGridClient(apiKey);
        var from = new EmailAddress(StaticMailer._mailOptions.MailFrom);
        var subject = "Admin password reset request.";
        var to = new EmailAddress(item.Email);
        var plainTextContent = $"Your Admin password has been reset. Your new username and password combination is \n\nUsername: {item.Username}\nPassword: {new_password_text}\n";
        var htmlContent = $"Your Admin password has been reset. Your new username and password combination is <br />Username: {item.Username}<br />Password: {new_password_text}<br />";
        var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
        var response = client.SendEmailAsync(msg).Result;

        var new_password = PasswordHasher.Hash(new_password_text);
        item.PasswordHash = new_password.PasswordHash;
        item.PasswordSalt = new_password.PasswordSalt;
        _context.Admin.Update(item);
        _context.SaveChanges();

        // HttpContext.Logout(_context);

        return Ok();
      }
      return Unauthorized();
    }
    [RestrictToUserType(new string[] {"Admin"})]
    [HttpGet("{id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*ItemWithEditable<AdminViewData>*/ GetById(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Admin : _context.Admin;
      var editable_items = ApiTokenValid ? _context.Admin : current_Admin != null ? _context.Admin : Enumerable.Empty<Admin>().AsQueryable();
      var item_full = allowed_items.FirstOrDefault(e => e.Id == id);
      if (item_full == null) return NotFound();
      var item = PortableRecipes.Models.Admin.FilterViewableAttributesLocal(current_User, current_Admin)(item_full);
      item = PortableRecipes.Models.Admin.WithoutImages(item);
      return Ok(new ItemWithEditable<AdminViewData>() {
        Item = AdminViewData.FromAdmin(item),
        Editable = editable_items.Any(e => e.Id == item.Id) });
    }
    

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult /*AdminViewData*/ Create()
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      if (_context.Admin.Any(u => u.Username == null || u.Email == null || u.Username == "" || u.Email == ""))
        return Unauthorized();
        // throw new Exception("Unauthorized create attempt");
      var can_create_by_token = ApiTokenValid || true;
      if (!can_create_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized create attempt");
      var item = new Admin() { CreatedDate = DateTime.Now, Id = _context.Admin.Max(i => i.Id) + 1 };
      _context.Admin.Add(PortableRecipes.Models.Admin.FilterViewableAttributesLocal(current_User, current_Admin)(item));
      _context.SaveChanges();
      item = PortableRecipes.Models.Admin.WithoutImages(item);
      return Ok(AdminViewData.FromAdmin(item));
    }

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPut]
    [ValidateAntiForgeryToken]
    public IActionResult Update([FromBody] AdminViewData item)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Admin : _context.Admin;
      if (!allowed_items.Any(i => i.Id == item.Id)) return Unauthorized();
      var new_item = AdminViewData.FromAdminViewData(item, _context);
      if (current_Admin != null && new_item.Id == current_Admin.Id)
           HttpContext.Set<LoggableEntities>(_context, new LoggableEntities() { Admin = new_item });
      var can_edit_by_token = ApiTokenValid || true;
      if (item == null || !can_edit_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized edit attempt");
      _context.Update(new_item);
      _context.Entry(new_item).Property(x => x.Username).IsModified = false;
      _context.Entry(new_item).Property(x => x.Email).IsModified = false;
      _context.Entry(new_item).Property(x => x.CreatedDate).IsModified = false;
      _context.SaveChanges();
      return Ok();
    }

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpDelete("{id}")]
    [ValidateAntiForgeryToken]
    public IActionResult Delete(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Admin : _context.Admin;
      var item = _context.Admin.FirstOrDefault(e => e.Id == id);
      var can_delete_by_token = ApiTokenValid || true;
      if (item == null || !can_delete_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized delete attempt");
      
      if (!allowed_items.Any(a => a.Id == item.Id)) return Unauthorized(); // throw new Exception("Unauthorized delete attempt");
      HttpContext.Deleted<Admin>(_context, "Admin", item);
      

      _context.Admin.Remove(item);
      _context.SaveChanges();
      return Ok();
    }


    [RestrictToUserType(new string[] {"Admin"})]
    [HttpGet]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<AdminViewData> GetAll([FromQuery] int page_index, [FromQuery] int page_size = 25 )
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Admin : _context.Admin;
      var editable_items = ApiTokenValid ? _context.Admin : current_Admin != null ? _context.Admin : Enumerable.Empty<Admin>().AsQueryable();
      var can_edit_by_token = ApiTokenValid || true;
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true;
      var items = allowed_items.OrderBy(i => i.CreatedDate).AsQueryable();
      
      return items
        .Select(PortableRecipes.Models.Admin.FilterViewableAttributes(current_User, current_Admin))
        .Select(s => Tuple.Create(s, can_edit_by_token && editable_items.Any(es => es.Id == s.Id)))
        .Paginate(can_create_by_token, can_delete_by_token, false, page_index, page_size, PortableRecipes.Models.Admin.WithoutImages, item => AdminViewData.FromAdmin(item) , null );
    }

    


    
  }

  