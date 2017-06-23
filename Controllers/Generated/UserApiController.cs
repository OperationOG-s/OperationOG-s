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


  [Route("api/v1/User")]
  public class UserApiController : Controller
  {
    private readonly MailOptions _mailOptions;
    public readonly PortableRecipesContext _context;
    private IHostingEnvironment env;

    public UserApiController(PortableRecipesContext context, IHostingEnvironment env, IOptions<MailOptions> mailOptionsAccessor)
    {
      _context = context;
      _mailOptions = mailOptionsAccessor.Value;
      this.env = env;
    }

    public bool ApiTokenValid => RestrictToUserTypeAttribute.ApiToken != null &&
        HttpContext.Request.Headers["ApiToken"] == RestrictToUserTypeAttribute.ApiToken;

    
    [RestrictToUserType(new string[] {"Admin", "User"})]
    [HttpPost("DeleteSessions")]
    [ValidateAntiForgeryToken]
    public IActionResult DeleteSessions() {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      if (session.User != null) {
        var item = _context.User.FirstOrDefault(t => t.Id == session.User.Id);
        if (item != null) {
          var allowed_items = ApiTokenValid ? _context.User : (current_User != null ? (from _User in _context.User where _User.Id == current_User.Id
select _User) : _context.User);
          if (!allowed_items.Any(i => i.Id == item.Id)) return Unauthorized();
          HttpContext.Deleted<User>(_context, "User", item);
          return Ok();
        }
      }
      return Unauthorized();
    }

    [RestrictToUserType(new string[] {"Admin", "User"})]
    [HttpPost("ActiveSessions")]
    [ValidateAntiForgeryToken]
    public IActionResult GetActiveSessions() {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      if (session.User != null) {
        var item = _context.User.FirstOrDefault(t => t.Id == session.User.Id);
        if (item != null) {
          var allowed_items = ApiTokenValid ? _context.User : _context.User;
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
          item = new User() { Id = _context.User.Max(i => i.Id) + 1, Username = username, Email = email, PasswordHash = new_password.PasswordHash, PasswordSalt = new_password.PasswordSalt };
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
    public IActionResult /*UserViewData*/ Login([FromBody] LoginData login_data)
    {
      var item = _context.User.FirstOrDefault(t => t.Username == login_data.Username || t.Email == login_data.Email);
      if (item != null) {
        var last_login_attempt = item.LastLoginAttempt;
        item.LastLoginAttempt = DateTime.Now;
        _context.Update(item);
        _context.SaveChanges();
        if (login_data.Password != null && (last_login_attempt != null || (DateTime.Now - last_login_attempt).TotalSeconds > 3)) {
          if (PasswordHasher.CheckHash(login_data.Password, new PasswordAndSalt(){ PasswordHash = item.PasswordHash, PasswordSalt = item.PasswordSalt })) {
            HttpContext.Login<LoggableEntities, User>(env, _context, "User", item, new LoggableEntities() { User = item });

            return Ok(UserViewData.FromUser(item));
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

    [RestrictToUserType(new string[] {"Admin", "User"})]
    [HttpPost("ChangePassword")]
    [ValidateAntiForgeryToken]
    public IActionResult ChangePassword([FromBody] ChangePasswordData change_password_data)
    {
      var item = _context.User.FirstOrDefault(t => t.Username == change_password_data.Username);
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      if (item != null &&
          change_password_data.Username != null && change_password_data.Password != null &&
          change_password_data.NewPassword != null && change_password_data.NewPasswordConfirmation != null) {
        var allowed_items = ApiTokenValid ? _context.User : (current_User != null ? (from _User in _context.User where _User.Id == current_User.Id
select _User) : _context.User);
        if (!allowed_items.Any(i => i.Id == item.Id)) return Unauthorized();
        if (change_password_data.NewPassword == change_password_data.NewPasswordConfirmation && PasswordHasher.CheckHash(change_password_data.Password, new PasswordAndSalt(){ PasswordHash = item.PasswordHash, PasswordSalt = item.PasswordSalt })) {
          var new_password = PasswordHasher.Hash(change_password_data.NewPassword);
          item.PasswordHash = new_password.PasswordHash;
          item.PasswordSalt = new_password.PasswordSalt;
          _context.User.Update(item);
          _context.SaveChanges();

          HttpContext.ChangedPassword<User>(_context, "User", item);
          // HttpContext.Login<LoggableEntities, User>(_context, "User", item, new LoggableEntities() { User = item });

          return Ok();
        }
      }
      return Unauthorized();
    }

    [HttpPost("ResetPassword")]
    [ValidateAntiForgeryToken]
    public IActionResult ResetPassword([FromBody] ResetPasswordData reset_password_data)
    {
      var item = _context.User.FirstOrDefault(t => t.Username == reset_password_data.Username || t.Email == reset_password_data.Email);
      if (item != null && (reset_password_data.Username != null || reset_password_data.Email != null)) {
        var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
        var allowed_items = ApiTokenValid ? _context.User : (current_User != null ? (from _User in _context.User where _User.Id == current_User.Id
select _User) : _context.User);
        if (!allowed_items.Any(i => i.Id == item.Id)) return Unauthorized();

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
      return Unauthorized();
    }
    [RestrictToUserType(new string[] {"Admin", "User"})]
    [HttpGet("{User_id}/User_Recipess")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Recipes> GetUser_Recipess(int User_id, [FromQuery] int page_index, [FromQuery] int page_size = 25 )
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.User : _context.User;
      var source = allowed_sources.FirstOrDefault(s => s.Id == User_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token) // test
        return Enumerable.Empty<PortableRecipes.Models.Recipes>() // B
              .AsQueryable()
              .Select(PortableRecipes.Models.Recipes.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Recipes.WithoutImages, item => item , null);
      var allowed_targets = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var editable_targets = ApiTokenValid ? _context.Recipes : (_context.Recipes);
      var can_edit_by_token = ApiTokenValid || true;
      var items = (from link in _context.User_Recipes
              where link.UserId == source.Id
              from target in allowed_targets
              where link.RecipesId == target.Id
              select target).OrderBy(i => i.CreatedDate).AsQueryable();
      
      return items
              .Select(PortableRecipes.Models.Recipes.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Recipes.WithoutImages, item => item , null);
    }

    [HttpGet("{User_id}/User_Recipess/{Recipes_id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*Recipes*/ GetUser_RecipesById(int User_id, int Recipes_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.User : _context.User;
      var source = allowed_sources.FirstOrDefault(s => s.Id == User_id);
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return NotFound();
      var allowed_targets = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var item = (from link in _context.User_Recipes
              where link.UserId == source.Id
              from target in allowed_targets
              where link.RecipesId == target.Id
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Recipes.FilterViewableAttributes(current_User, current_Admin))
              .FirstOrDefault(t => t.Id == Recipes_id);
      if (item == null) return NotFound();
      item = PortableRecipes.Models.Recipes.WithoutImages(item);
      return Ok(item);
    }

    [RestrictToUserType(new string[] {"Admin", "User"})]
    [HttpGet("{User_id}/unlinked/User_Recipess")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Recipes> GetUnlinkedUser_Recipess(int User_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.User : _context.User;
      var source = allowed_sources.FirstOrDefault(s => s.Id == User_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return Enumerable.Empty<PortableRecipes.Models.Recipes>()
              .AsQueryable()
              .Select(PortableRecipes.Models.Recipes.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Recipes.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var editable_targets = ApiTokenValid ? _context.Recipes : (_context.Recipes);
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.User_Recipes.Any(link => link.UserId == source.Id && link.RecipesId == target.Id) &&
              true
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Recipes.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Recipes.WithoutImages, item => item);
    }

    bool CanAdd_User_User_Recipess(User source) {
      return true;
    }

    bool CanAdd_Recipes_User_Recipess(Recipes target) {
      return true;
    }

    [RestrictToUserType(new string[] {"Admin", "User"})]
    [HttpPost("{User_id}/User_Recipess_Recipes")]
    public IActionResult /*IEnumerable<Recipes>*/ CreateNewUser_Recipes_Recipes(int User_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.User : _context.User;
      var source = allowed_sources.FirstOrDefault(s => s.Id == User_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        return Unauthorized();
        // throw new Exception("Cannot create item in relation User_Recipess");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_User_User_Recipess(source) || !can_link_by_token)
        return Unauthorized();
        //throw new Exception("Cannot add item to relation User_Recipess");
      var new_target = new Recipes() { CreatedDate = DateTime.Now, Id = _context.Recipes.Max(i => i.Id) + 1 };
      _context.Recipes.Add(new_target);
      _context.SaveChanges();
      var link = new User_Recipes() { Id = _context.User_Recipes.Max(l => l.Id) + 1, UserId = source.Id, RecipesId = new_target.Id };
      _context.User_Recipes.Add(link);
      _context.SaveChanges();
      return Ok(new Recipes[] { new_target });
    }

    [RestrictToUserType(new string[] {"Admin", "User"})]
    [HttpPost("{User_id}/User_Recipess/{Recipes_id}")]
    public IActionResult LinkWithUser_Recipes(int User_id, int Recipes_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.User;
      var source = allowed_sources.FirstOrDefault(s => s.Id == User_id);
      var allowed_targets = _context.Recipes;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Recipes_id);
      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_User_User_Recipess(source) || !can_link_by_token || !can_edit_source_by_token || !can_edit_target_by_token)
        return BadRequest();
        // throw new Exception("Cannot add item to relation User_Recipess");
      if (!CanAdd_Recipes_User_Recipess(target))
        return BadRequest();
        // throw new Exception("Cannot add item to relation User_Recipess");
      var link = new User_Recipes() { Id = _context.User_Recipes.Max(i => i.Id) + 1, UserId = source.Id, RecipesId = target.Id };
      _context.User_Recipes.Add(link);
      _context.SaveChanges();
      return Ok();
    }
    [RestrictToUserType(new string[] {"Admin", "User"})]
    [HttpDelete("{User_id}/User_Recipess/{Recipes_id}")]
    public IActionResult UnlinkFromUser_Recipes(int User_id, int Recipes_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.User;
      var source = allowed_sources.FirstOrDefault(s => s.Id == User_id);
      var allowed_targets = _context.Recipes;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Recipes_id);
      var link = _context.User_Recipes.FirstOrDefault(l => l.UserId == source.Id && l.RecipesId == target.Id);

      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_unlink_by_token = ApiTokenValid || true;
      if (!can_unlink_by_token || !can_edit_source_by_token || !can_edit_target_by_token) return Unauthorized(); // throw new Exception("Cannot remove item from relation User_Recipess");
      _context.User_Recipes.Remove(link);
      _context.SaveChanges();
      return Ok();
    }
    [RestrictToUserType(new string[] {"Admin", "User"})]
    [HttpGet("{id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*ItemWithEditable<UserViewData>*/ GetById(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.User : _context.User;
      var editable_items = ApiTokenValid ? _context.User : current_Admin != null || current_User != null ? (current_User != null ? (from _User in _context.User where _User.Id == current_User.Id
select _User) : _context.User) : Enumerable.Empty<User>().AsQueryable();
      var item_full = allowed_items.FirstOrDefault(e => e.Id == id);
      if (item_full == null) return NotFound();
      var item = PortableRecipes.Models.User.FilterViewableAttributesLocal(current_User, current_Admin)(item_full);
      item = PortableRecipes.Models.User.WithoutImages(item);
      return Ok(new ItemWithEditable<UserViewData>() {
        Item = UserViewData.FromUser(item),
        Editable = editable_items.Any(e => e.Id == item.Id) });
    }
    

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult /*UserViewData*/ Create()
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      if (_context.User.Any(u => u.Username == null || u.Email == null || u.Username == "" || u.Email == ""))
        return Unauthorized();
        // throw new Exception("Unauthorized create attempt");
      var can_create_by_token = ApiTokenValid || true;
      if (!can_create_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized create attempt");
      var item = new User() { CreatedDate = DateTime.Now, Id = _context.User.Max(i => i.Id) + 1 };
      _context.User.Add(PortableRecipes.Models.User.FilterViewableAttributesLocal(current_User, current_Admin)(item));
      _context.SaveChanges();
      item = PortableRecipes.Models.User.WithoutImages(item);
      return Ok(UserViewData.FromUser(item));
    }

    [RestrictToUserType(new string[] {"Admin", "User"})]
    [HttpPut]
    [ValidateAntiForgeryToken]
    public IActionResult Update([FromBody] UserViewData item)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.User : (current_User != null ? (from _User in _context.User where _User.Id == current_User.Id
select _User) : _context.User);
      if (!allowed_items.Any(i => i.Id == item.Id)) return Unauthorized();
      var new_item = UserViewData.FromUserViewData(item, _context);
      if (current_User != null && new_item.Id == current_User.Id)
           HttpContext.Set<LoggableEntities>(_context, new LoggableEntities() { User = new_item });
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
      var allowed_items = ApiTokenValid ? _context.User : _context.User;
      var item = _context.User.FirstOrDefault(e => e.Id == id);
      var can_delete_by_token = ApiTokenValid || true;
      if (item == null || !can_delete_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized delete attempt");
      
      if (!allowed_items.Any(a => a.Id == item.Id)) return Unauthorized(); // throw new Exception("Unauthorized delete attempt");
      HttpContext.Deleted<User>(_context, "User", item);
      

      _context.User.Remove(item);
      _context.SaveChanges();
      return Ok();
    }


    [RestrictToUserType(new string[] {"Admin", "User"})]
    [HttpGet]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<UserViewData> GetAll([FromQuery] int page_index, [FromQuery] int page_size = 25 )
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
      var items = allowed_items.OrderBy(i => i.CreatedDate).AsQueryable();
      
      return items
        .Select(PortableRecipes.Models.User.FilterViewableAttributes(current_User, current_Admin))
        .Select(s => Tuple.Create(s, can_edit_by_token && editable_items.Any(es => es.Id == s.Id)))
        .Paginate(can_create_by_token, can_delete_by_token, false, page_index, page_size, PortableRecipes.Models.User.WithoutImages, item => UserViewData.FromUser(item) , null );
    }

    


    
  }

  