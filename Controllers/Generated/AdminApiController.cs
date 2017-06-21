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


  [Route("api/v1/Admin")]
  public class AdminApiController : Controller
  {
    private readonly MailOptions _mailOptions;
    public readonly PortableRecipesContext _context;

    public AdminApiController(PortableRecipesContext context, IOptions<MailOptions> mailOptionsAccessor)
    {
      _context = context;
      _mailOptions = mailOptionsAccessor.Value;
    }

    public bool ApiTokenValid => RestrictToUserTypeAttribute.ApiToken != null &&
        HttpContext.Request.Headers["ApiToken"] == RestrictToUserTypeAttribute.ApiToken;

    
    

    [HttpPost("Login")]
    [ValidateAntiForgeryToken]
    public AdminViewData Login([FromBody] LoginData login_data)
    {
      var item = _context.Admin.FirstOrDefault(t => t.Username == login_data.Username || t.Email == login_data.Email);
      if (item != null && login_data.Password != null) {
        if (PasswordHasher.CheckHash(login_data.Password, new PasswordAndSalt(){ PasswordHash = item.PasswordHash, PasswordSalt = item.PasswordSalt })) {
          HttpContext.Login<LoggableEntities>(_context, new LoggableEntities() { Admin = item });

          return AdminViewData.FromAdmin(item);
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
      var item = _context.Admin.FirstOrDefault(t => t.Username == change_password_data.Username);
      var session = HttpContext.Get<LoggableEntities>(_context);
      if (item != null && session.Admin != null &&
          session.Admin.Id == item.Id &&
          change_password_data.Username != null && change_password_data.Password != null &&
          change_password_data.NewPassword != null && change_password_data.NewPasswordConfirmation != null) {
        if (change_password_data.NewPassword == change_password_data.NewPasswordConfirmation && PasswordHasher.CheckHash(change_password_data.Password, new PasswordAndSalt(){ PasswordHash = item.PasswordHash, PasswordSalt = item.PasswordSalt })) {
          var new_password = PasswordHasher.Hash(change_password_data.NewPassword);
          item.PasswordHash = new_password.PasswordHash;
          item.PasswordSalt = new_password.PasswordSalt;
          _context.Admin.Update(item);
          _context.SaveChanges();

          HttpContext.Login<LoggableEntities>(_context, new LoggableEntities() { Admin = item });

          return Ok();
        }
      }
      throw new Exception("Cannot change password.");
    }

    [HttpPost("ResetPassword")]
    [ValidateAntiForgeryToken]
    public IActionResult ResetPassword([FromBody] ResetPasswordData reset_password_data)
    {
      var item = _context.Admin.FirstOrDefault(t => t.Username == reset_password_data.Username || t.Email == reset_password_data.Email);
      if (item != null && (reset_password_data.Username != null || reset_password_data.Email != null)) {
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
      throw new Exception("Cannot reset password.");
    }
    [RestrictToUserType(new string[] {"Admin"})]
    [HttpGet("{id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public ItemWithEditable<AdminViewData> GetById(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Admin : _context.Admin;
      var editable_items = ApiTokenValid ? _context.Admin : current_Admin != null ? _context.Admin : Enumerable.Empty<Admin>().AsQueryable();
      var item = PortableRecipes.Models.Admin.FilterViewableAttributesLocal(current_User, current_Admin)(allowed_items.FirstOrDefault(e => e.Id == id));
      item = PortableRecipes.Models.Admin.WithoutImages(item);
      return new ItemWithEditable<AdminViewData>() {
        Item = AdminViewData.FromAdmin(item),
        Editable = editable_items.Any(e => e.Id == item.Id) };
    }
    

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public AdminViewData Create()
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      if (_context.Admin.Any(u => u.Username == null || u.Email == null || u.Username == "" || u.Email == ""))
        throw new Exception("Unauthorized create attempt");
      var can_create_by_token = ApiTokenValid || true;
      if (!can_create_by_token)
        throw new Exception("Unauthorized create attempt");
      var item = new Admin() { CreatedDate = DateTime.Now, Id = _context.Admin.Max(i => i.Id) + 1 };
      _context.Admin.Add(PortableRecipes.Models.Admin.FilterViewableAttributesLocal(current_User, current_Admin)(item));
      _context.SaveChanges();
      item = PortableRecipes.Models.Admin.WithoutImages(item);
      return AdminViewData.FromAdmin(item);
    }

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPut]
    [ValidateAntiForgeryToken]
    public void Update([FromBody] AdminViewData item)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Admin : _context.Admin;
      if (!allowed_items.Any(i => i.Id == item.Id)) return;
      var new_item = AdminViewData.FromAdminViewData(item, _context);
      if (current_Admin != null && new_item.Id == current_Admin.Id)
           HttpContext.Set<LoggableEntities>(_context, new LoggableEntities() { Admin = new_item });
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
      var allowed_items = ApiTokenValid ? _context.Admin : _context.Admin;
      var item = _context.Admin.FirstOrDefault(e => e.Id == id);
      var can_delete_by_token = ApiTokenValid || true;
      if (item == null || !can_delete_by_token)
        throw new Exception("Unauthorized delete attempt");
      
      if (!allowed_items.Any(a => a.Id == item.Id)) throw new Exception("Unauthorized delete attempt");
      
      _context.Admin.Remove(item);
      _context.SaveChanges();
    }

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpGet]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<AdminViewData> GetAll([FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Admin : _context.Admin;
      var editable_items = ApiTokenValid ? _context.Admin : current_Admin != null ? _context.Admin : Enumerable.Empty<Admin>().AsQueryable();
      var can_edit_by_token = ApiTokenValid || true;
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true;
      return allowed_items
        .Select(PortableRecipes.Models.Admin.FilterViewableAttributes(current_User, current_Admin))
        .Select(s => Tuple.Create(s, can_edit_by_token && editable_items.Any(es => es.Id == s.Id)))
        .Paginate(can_create_by_token, can_delete_by_token, false, page_index, page_size, PortableRecipes.Models.Admin.WithoutImages, item => AdminViewData.FromAdmin(item));
    }

    


    
  }

  