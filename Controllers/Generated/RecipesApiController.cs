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


  [Route("api/v1/Recipes")]
  public class RecipesApiController : Controller
  {
    private readonly MailOptions _mailOptions;
    public readonly PortableRecipesContext _context;

    public RecipesApiController(PortableRecipesContext context, IOptions<MailOptions> mailOptionsAccessor)
    {
      _context = context;
      _mailOptions = mailOptionsAccessor.Value;
    }

    public bool ApiTokenValid => RestrictToUserTypeAttribute.ApiToken != null &&
        HttpContext.Request.Headers["ApiToken"] == RestrictToUserTypeAttribute.ApiToken;

    
    [RestrictToUserType(new string[] {"Admin", "User"})]
    [HttpGet("{Recipes_id}/User_Recipess")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<UserViewData> GetUser_Recipess(int Recipes_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token) // test
        return Enumerable.Empty<PortableRecipes.Models.User>() // B
              .AsQueryable()
              .Select(PortableRecipes.Models.User.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.User.WithoutImages, item => UserViewData.FromUser(item));
      var allowed_targets = ApiTokenValid ? _context.User : _context.User;
      var editable_targets = ApiTokenValid ? _context.User : (current_Admin != null || current_User != null ? (current_User != null ? (from _User in _context.User where _User.Id == current_User.Id
select _User) : _context.User) : Enumerable.Empty<User>().AsQueryable());
      var can_edit_by_token = ApiTokenValid || true;
      return (from link in _context.User_Recipes
              where link.RecipesId == source.Id
              from target in allowed_targets
              where link.UserId == target.Id
              select target)
              .Select(PortableRecipes.Models.User.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.User.WithoutImages, item => UserViewData.FromUser(item));
    }

    [HttpGet("{Recipes_id}/User_Recipess/{User_id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public UserViewData GetUser_RecipesById(int Recipes_id, int User_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return null;
      var allowed_targets = ApiTokenValid ? _context.User : _context.User;
      var item = (from link in _context.User_Recipes
              where link.RecipesId == source.Id
              from target in allowed_targets
              where link.UserId == target.Id
              select target)
              .Select(PortableRecipes.Models.User.FilterViewableAttributes(current_User, current_Admin))
              .FirstOrDefault(t => t.Id == User_id);

      item = PortableRecipes.Models.User.WithoutImages(item);
      return UserViewData.FromUser(item);
    }

    [RestrictToUserType(new string[] {"Admin", "User"})]
    [HttpGet("{Recipes_id}/unlinked/User_Recipess")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<UserViewData> GetUnlinkedUser_Recipess(int Recipes_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token) // test
        return Enumerable.Empty<PortableRecipes.Models.User>() // C
              .AsQueryable()
              .Select(PortableRecipes.Models.User.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.User.WithoutImages, item => UserViewData.FromUser(item));
      var allowed_targets = ApiTokenValid ? _context.User : _context.User;
      var editable_targets = ApiTokenValid ? _context.User : (current_Admin != null || current_User != null ? (current_User != null ? (from _User in _context.User where _User.Id == current_User.Id
select _User) : _context.User) : Enumerable.Empty<User>().AsQueryable());
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.User_Recipes.Any(link => link.RecipesId == source.Id && link.UserId == target.Id) &&
              true
              select target)
              .Select(PortableRecipes.Models.User.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.User.WithoutImages, item => UserViewData.FromUser(item));
    }

    bool CanAdd_Recipes_User_Recipess(Recipes source) {
      return true;
    }

    bool CanAdd_User_User_Recipess(User target) {
      return true;
    }

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPost("{Recipes_id}/User_Recipess_User")]
    public IEnumerable<UserViewData> CreateNewUser_Recipes_User(int Recipes_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        throw new Exception("Cannot create item in relation User_Recipess");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Recipes_User_Recipess(source) || !can_link_by_token)
        throw new Exception("Cannot add item to relation User_Recipess");
      var new_target = new User() { CreatedDate = DateTime.Now, Id = _context.User.Max(i => i.Id) + 1 };
      _context.User.Add(new_target);
      _context.SaveChanges();
      var link = new User_Recipes() { Id = _context.User_Recipes.Max(l => l.Id) + 1, RecipesId = source.Id, UserId = new_target.Id };
      _context.User_Recipes.Add(link);
      _context.SaveChanges();
      return new UserViewData[] { UserViewData.FromUser(new_target) };
    }

    [RestrictToUserType(new string[] {"Admin", "User"})]
    [HttpPost("{Recipes_id}/User_Recipess/{User_id}")]
    public void LinkWithUser_Recipes(int Recipes_id, int User_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var allowed_targets = _context.User;
      var target = allowed_targets.FirstOrDefault(s => s.Id == User_id);
      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Recipes_User_Recipess(source) || !can_link_by_token || !can_edit_source_by_token || !can_edit_target_by_token)
        throw new Exception("Cannot add item to relation User_Recipess");
      if (!CanAdd_User_User_Recipess(target))
        throw new Exception("Cannot add item to relation User_Recipess");
      var link = new User_Recipes() { Id = _context.User_Recipes.Max(i => i.Id) + 1, RecipesId = source.Id, UserId = target.Id };
      _context.User_Recipes.Add(link);
      _context.SaveChanges();
    }
    [RestrictToUserType(new string[] {"Admin", "User"})]
    [HttpDelete("{Recipes_id}/User_Recipess/{User_id}")]
    public void UnlinkFromUser_Recipes(int Recipes_id, int User_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var allowed_targets = _context.User;
      var target = allowed_targets.FirstOrDefault(s => s.Id == User_id);
      var link = _context.User_Recipes.FirstOrDefault(l => l.RecipesId == source.Id && l.UserId == target.Id);

      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_unlink_by_token = ApiTokenValid || true;
      if (!can_unlink_by_token || !can_edit_source_by_token || !can_edit_target_by_token) throw new Exception("Cannot remove item from relation User_Recipess");
      _context.User_Recipes.Remove(link);
      _context.SaveChanges();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Recipes_id}/Dinner_Recipess")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Dinner> GetDinner_Recipess(int Recipes_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token) // test
        return Enumerable.Empty<PortableRecipes.Models.Dinner>() // B
              .AsQueryable()
              .Select(PortableRecipes.Models.Dinner.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Dinner.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.Dinner : _context.Dinner;
      var editable_targets = ApiTokenValid ? _context.Dinner : (_context.Dinner);
      var can_edit_by_token = ApiTokenValid || true;
      return (from link in _context.Dinner_Recipes
              where link.RecipesId == source.Id
              from target in allowed_targets
              where link.DinnerId == target.Id
              select target)
              .Select(PortableRecipes.Models.Dinner.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Dinner.WithoutImages, item => item);
    }

    [HttpGet("{Recipes_id}/Dinner_Recipess/{Dinner_id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Dinner GetDinner_RecipesById(int Recipes_id, int Dinner_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return null;
      var allowed_targets = ApiTokenValid ? _context.Dinner : _context.Dinner;
      var item = (from link in _context.Dinner_Recipes
              where link.RecipesId == source.Id
              from target in allowed_targets
              where link.DinnerId == target.Id
              select target)
              .Select(PortableRecipes.Models.Dinner.FilterViewableAttributes(current_User, current_Admin))
              .FirstOrDefault(t => t.Id == Dinner_id);

      item = PortableRecipes.Models.Dinner.WithoutImages(item);
      return item;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Recipes_id}/unlinked/Dinner_Recipess")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Dinner> GetUnlinkedDinner_Recipess(int Recipes_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token) // test
        return Enumerable.Empty<PortableRecipes.Models.Dinner>() // C
              .AsQueryable()
              .Select(PortableRecipes.Models.Dinner.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Dinner.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.Dinner : _context.Dinner;
      var editable_targets = ApiTokenValid ? _context.Dinner : (_context.Dinner);
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.Dinner_Recipes.Any(link => link.RecipesId == source.Id && link.DinnerId == target.Id) &&
              true
              select target)
              .Select(PortableRecipes.Models.Dinner.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Dinner.WithoutImages, item => item);
    }

    bool CanAdd_Recipes_Dinner_Recipess(Recipes source) {
      return true;
    }

    bool CanAdd_Dinner_Dinner_Recipess(Dinner target) {
      return true;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Recipes_id}/Dinner_Recipess_Dinner")]
    public IEnumerable<Dinner> CreateNewDinner_Recipes_Dinner(int Recipes_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        throw new Exception("Cannot create item in relation Dinner_Recipess");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Recipes_Dinner_Recipess(source) || !can_link_by_token)
        throw new Exception("Cannot add item to relation Dinner_Recipess");
      var new_target = new Dinner() { CreatedDate = DateTime.Now, Id = _context.Meal.Max(i => i.Id) + 1 };
      _context.Dinner.Add(new_target);
      _context.SaveChanges();
      var link = new Dinner_Recipes() { Id = _context.Dinner_Recipes.Max(l => l.Id) + 1, RecipesId = source.Id, DinnerId = new_target.Id };
      _context.Dinner_Recipes.Add(link);
      _context.SaveChanges();
      return new Dinner[] { new_target };
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Recipes_id}/Dinner_Recipess/{Dinner_id}")]
    public void LinkWithDinner_Recipes(int Recipes_id, int Dinner_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var allowed_targets = _context.Dinner;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Dinner_id);
      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Recipes_Dinner_Recipess(source) || !can_link_by_token || !can_edit_source_by_token || !can_edit_target_by_token)
        throw new Exception("Cannot add item to relation Dinner_Recipess");
      if (!CanAdd_Dinner_Dinner_Recipess(target))
        throw new Exception("Cannot add item to relation Dinner_Recipess");
      var link = new Dinner_Recipes() { Id = _context.Dinner_Recipes.Max(i => i.Id) + 1, RecipesId = source.Id, DinnerId = target.Id };
      _context.Dinner_Recipes.Add(link);
      _context.SaveChanges();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpDelete("{Recipes_id}/Dinner_Recipess/{Dinner_id}")]
    public void UnlinkFromDinner_Recipes(int Recipes_id, int Dinner_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var allowed_targets = _context.Dinner;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Dinner_id);
      var link = _context.Dinner_Recipes.FirstOrDefault(l => l.RecipesId == source.Id && l.DinnerId == target.Id);

      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_unlink_by_token = ApiTokenValid || true;
      if (!can_unlink_by_token || !can_edit_source_by_token || !can_edit_target_by_token) throw new Exception("Cannot remove item from relation Dinner_Recipess");
      _context.Dinner_Recipes.Remove(link);
      _context.SaveChanges();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Recipes_id}/Breakfast_Recipess")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Breakfast> GetBreakfast_Recipess(int Recipes_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token) // test
        return Enumerable.Empty<PortableRecipes.Models.Breakfast>() // B
              .AsQueryable()
              .Select(PortableRecipes.Models.Breakfast.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Breakfast.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.Breakfast : _context.Breakfast;
      var editable_targets = ApiTokenValid ? _context.Breakfast : (_context.Breakfast);
      var can_edit_by_token = ApiTokenValid || true;
      return (from link in _context.Breakfast_Recipes
              where link.RecipesId == source.Id
              from target in allowed_targets
              where link.BreakfastId == target.Id
              select target)
              .Select(PortableRecipes.Models.Breakfast.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Breakfast.WithoutImages, item => item);
    }

    [HttpGet("{Recipes_id}/Breakfast_Recipess/{Breakfast_id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Breakfast GetBreakfast_RecipesById(int Recipes_id, int Breakfast_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return null;
      var allowed_targets = ApiTokenValid ? _context.Breakfast : _context.Breakfast;
      var item = (from link in _context.Breakfast_Recipes
              where link.RecipesId == source.Id
              from target in allowed_targets
              where link.BreakfastId == target.Id
              select target)
              .Select(PortableRecipes.Models.Breakfast.FilterViewableAttributes(current_User, current_Admin))
              .FirstOrDefault(t => t.Id == Breakfast_id);

      item = PortableRecipes.Models.Breakfast.WithoutImages(item);
      return item;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Recipes_id}/unlinked/Breakfast_Recipess")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Breakfast> GetUnlinkedBreakfast_Recipess(int Recipes_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token) // test
        return Enumerable.Empty<PortableRecipes.Models.Breakfast>() // C
              .AsQueryable()
              .Select(PortableRecipes.Models.Breakfast.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Breakfast.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.Breakfast : _context.Breakfast;
      var editable_targets = ApiTokenValid ? _context.Breakfast : (_context.Breakfast);
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.Breakfast_Recipes.Any(link => link.RecipesId == source.Id && link.BreakfastId == target.Id) &&
              true
              select target)
              .Select(PortableRecipes.Models.Breakfast.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Breakfast.WithoutImages, item => item);
    }

    bool CanAdd_Recipes_Breakfast_Recipess(Recipes source) {
      return true;
    }

    bool CanAdd_Breakfast_Breakfast_Recipess(Breakfast target) {
      return true;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Recipes_id}/Breakfast_Recipess_Breakfast")]
    public IEnumerable<Breakfast> CreateNewBreakfast_Recipes_Breakfast(int Recipes_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        throw new Exception("Cannot create item in relation Breakfast_Recipess");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Recipes_Breakfast_Recipess(source) || !can_link_by_token)
        throw new Exception("Cannot add item to relation Breakfast_Recipess");
      var new_target = new Breakfast() { CreatedDate = DateTime.Now, Id = _context.Meal.Max(i => i.Id) + 1 };
      _context.Breakfast.Add(new_target);
      _context.SaveChanges();
      var link = new Breakfast_Recipes() { Id = _context.Breakfast_Recipes.Max(l => l.Id) + 1, RecipesId = source.Id, BreakfastId = new_target.Id };
      _context.Breakfast_Recipes.Add(link);
      _context.SaveChanges();
      return new Breakfast[] { new_target };
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Recipes_id}/Breakfast_Recipess/{Breakfast_id}")]
    public void LinkWithBreakfast_Recipes(int Recipes_id, int Breakfast_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var allowed_targets = _context.Breakfast;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Breakfast_id);
      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Recipes_Breakfast_Recipess(source) || !can_link_by_token || !can_edit_source_by_token || !can_edit_target_by_token)
        throw new Exception("Cannot add item to relation Breakfast_Recipess");
      if (!CanAdd_Breakfast_Breakfast_Recipess(target))
        throw new Exception("Cannot add item to relation Breakfast_Recipess");
      var link = new Breakfast_Recipes() { Id = _context.Breakfast_Recipes.Max(i => i.Id) + 1, RecipesId = source.Id, BreakfastId = target.Id };
      _context.Breakfast_Recipes.Add(link);
      _context.SaveChanges();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpDelete("{Recipes_id}/Breakfast_Recipess/{Breakfast_id}")]
    public void UnlinkFromBreakfast_Recipes(int Recipes_id, int Breakfast_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var allowed_targets = _context.Breakfast;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Breakfast_id);
      var link = _context.Breakfast_Recipes.FirstOrDefault(l => l.RecipesId == source.Id && l.BreakfastId == target.Id);

      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_unlink_by_token = ApiTokenValid || true;
      if (!can_unlink_by_token || !can_edit_source_by_token || !can_edit_target_by_token) throw new Exception("Cannot remove item from relation Breakfast_Recipess");
      _context.Breakfast_Recipes.Remove(link);
      _context.SaveChanges();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Recipes_id}/Lunch_Recipess")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Lunch> GetLunch_Recipess(int Recipes_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token) // test
        return Enumerable.Empty<PortableRecipes.Models.Lunch>() // B
              .AsQueryable()
              .Select(PortableRecipes.Models.Lunch.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Lunch.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.Lunch : _context.Lunch;
      var editable_targets = ApiTokenValid ? _context.Lunch : (_context.Lunch);
      var can_edit_by_token = ApiTokenValid || true;
      return (from link in _context.Lunch_Recipes
              where link.RecipesId == source.Id
              from target in allowed_targets
              where link.LunchId == target.Id
              select target)
              .Select(PortableRecipes.Models.Lunch.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Lunch.WithoutImages, item => item);
    }

    [HttpGet("{Recipes_id}/Lunch_Recipess/{Lunch_id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Lunch GetLunch_RecipesById(int Recipes_id, int Lunch_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return null;
      var allowed_targets = ApiTokenValid ? _context.Lunch : _context.Lunch;
      var item = (from link in _context.Lunch_Recipes
              where link.RecipesId == source.Id
              from target in allowed_targets
              where link.LunchId == target.Id
              select target)
              .Select(PortableRecipes.Models.Lunch.FilterViewableAttributes(current_User, current_Admin))
              .FirstOrDefault(t => t.Id == Lunch_id);

      item = PortableRecipes.Models.Lunch.WithoutImages(item);
      return item;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Recipes_id}/unlinked/Lunch_Recipess")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Lunch> GetUnlinkedLunch_Recipess(int Recipes_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token) // test
        return Enumerable.Empty<PortableRecipes.Models.Lunch>() // C
              .AsQueryable()
              .Select(PortableRecipes.Models.Lunch.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Lunch.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.Lunch : _context.Lunch;
      var editable_targets = ApiTokenValid ? _context.Lunch : (_context.Lunch);
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.Lunch_Recipes.Any(link => link.RecipesId == source.Id && link.LunchId == target.Id) &&
              true
              select target)
              .Select(PortableRecipes.Models.Lunch.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Lunch.WithoutImages, item => item);
    }

    bool CanAdd_Recipes_Lunch_Recipess(Recipes source) {
      return true;
    }

    bool CanAdd_Lunch_Lunch_Recipess(Lunch target) {
      return true;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Recipes_id}/Lunch_Recipess_Lunch")]
    public IEnumerable<Lunch> CreateNewLunch_Recipes_Lunch(int Recipes_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        throw new Exception("Cannot create item in relation Lunch_Recipess");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Recipes_Lunch_Recipess(source) || !can_link_by_token)
        throw new Exception("Cannot add item to relation Lunch_Recipess");
      var new_target = new Lunch() { CreatedDate = DateTime.Now, Id = _context.Meal.Max(i => i.Id) + 1 };
      _context.Lunch.Add(new_target);
      _context.SaveChanges();
      var link = new Lunch_Recipes() { Id = _context.Lunch_Recipes.Max(l => l.Id) + 1, RecipesId = source.Id, LunchId = new_target.Id };
      _context.Lunch_Recipes.Add(link);
      _context.SaveChanges();
      return new Lunch[] { new_target };
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Recipes_id}/Lunch_Recipess/{Lunch_id}")]
    public void LinkWithLunch_Recipes(int Recipes_id, int Lunch_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var allowed_targets = _context.Lunch;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Lunch_id);
      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Recipes_Lunch_Recipess(source) || !can_link_by_token || !can_edit_source_by_token || !can_edit_target_by_token)
        throw new Exception("Cannot add item to relation Lunch_Recipess");
      if (!CanAdd_Lunch_Lunch_Recipess(target))
        throw new Exception("Cannot add item to relation Lunch_Recipess");
      var link = new Lunch_Recipes() { Id = _context.Lunch_Recipes.Max(i => i.Id) + 1, RecipesId = source.Id, LunchId = target.Id };
      _context.Lunch_Recipes.Add(link);
      _context.SaveChanges();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpDelete("{Recipes_id}/Lunch_Recipess/{Lunch_id}")]
    public void UnlinkFromLunch_Recipes(int Recipes_id, int Lunch_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var allowed_targets = _context.Lunch;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Lunch_id);
      var link = _context.Lunch_Recipes.FirstOrDefault(l => l.RecipesId == source.Id && l.LunchId == target.Id);

      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_unlink_by_token = ApiTokenValid || true;
      if (!can_unlink_by_token || !can_edit_source_by_token || !can_edit_target_by_token) throw new Exception("Cannot remove item from relation Lunch_Recipess");
      _context.Lunch_Recipes.Remove(link);
      _context.SaveChanges();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public ItemWithEditable<Recipes> GetById(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var editable_items = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var item = PortableRecipes.Models.Recipes.FilterViewableAttributesLocal(current_User, current_Admin)(allowed_items.FirstOrDefault(e => e.Id == id));
      item = PortableRecipes.Models.Recipes.WithoutImages(item);
      return new ItemWithEditable<Recipes>() {
        Item = item,
        Editable = editable_items.Any(e => e.Id == item.Id) };
    }
    
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{id}/Picture")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Container<string> GetPictureById(int id)
    {
var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var item = PortableRecipes.Models.Recipes.FilterViewableAttributesLocal(current_User, current_Admin)(allowed_items.FirstOrDefault(e => e.Id == id));
      return new Container<string> { Content = item.Picture };
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPut("{id}/Picture")]
    [ValidateAntiForgeryToken]
    public void ChangePicture(int id, [FromBody] Container<string> Picture)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Recipes : _context.Recipes;
      if (!allowed_items.Any(i => i.Id == id)) return;
      var item = new Recipes() { Id = id, Picture = Picture.Content };
      _context.Recipes.Update(item);
      
      _context.Entry(item).Property(x => x.Name).IsModified = false;
      _context.Entry(item).Property(x => x.Ingredients).IsModified = false;
      _context.Entry(item).Property(x => x.Description).IsModified = false;
      _context.Entry(item).Property(x => x.PreparationTime).IsModified = false;
      _context.Entry(item).Property(x => x.CreatedDate).IsModified = false;
      _context.Entry(item).Property(x => x.Picture).IsModified = true;
      _context.SaveChanges();
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public Recipes Create()
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var can_create_by_token = ApiTokenValid || true;
      if (!can_create_by_token)
        throw new Exception("Unauthorized create attempt");
      var item = new Recipes() { CreatedDate = DateTime.Now, Id = _context.Recipes.Max(i => i.Id) + 1 };
      _context.Recipes.Add(PortableRecipes.Models.Recipes.FilterViewableAttributesLocal(current_User, current_Admin)(item));
      _context.SaveChanges();
      item = PortableRecipes.Models.Recipes.WithoutImages(item);
      return item;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPut]
    [ValidateAntiForgeryToken]
    public void Update([FromBody] Recipes item)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Recipes : _context.Recipes;
      if (!allowed_items.Any(i => i.Id == item.Id)) return;
      var new_item = item;
      
      var can_edit_by_token = ApiTokenValid || true;
      if (item == null || !can_edit_by_token)
        throw new Exception("Unauthorized edit attempt");
      _context.Update(new_item);
      _context.Entry(new_item).Property(x => x.Picture).IsModified = false;
      _context.Entry(new_item).Property(x => x.CreatedDate).IsModified = false;
      _context.SaveChanges();
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpDelete("{id}")]
    [ValidateAntiForgeryToken]
    public void Delete(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var item = _context.Recipes.FirstOrDefault(e => e.Id == id);
      var can_delete_by_token = ApiTokenValid || true;
      if (item == null || !can_delete_by_token)
        throw new Exception("Unauthorized delete attempt");
      
      if (!allowed_items.Any(a => a.Id == item.Id)) throw new Exception("Unauthorized delete attempt");
      
      _context.Recipes.Remove(item);
      _context.SaveChanges();
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpGet]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Recipes> GetAll([FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var editable_items = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var can_edit_by_token = ApiTokenValid || true;
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true;
      return allowed_items
        .Select(PortableRecipes.Models.Recipes.FilterViewableAttributes(current_User, current_Admin))
        .Select(s => Tuple.Create(s, can_edit_by_token && editable_items.Any(es => es.Id == s.Id)))
        .Paginate(can_create_by_token, can_delete_by_token, false, page_index, page_size, PortableRecipes.Models.Recipes.WithoutImages, item => item);
    }

    


    
  }

  