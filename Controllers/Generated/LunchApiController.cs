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


  [Route("api/v1/Lunch")]
  public class LunchApiController : Controller
  {
    private readonly MailOptions _mailOptions;
    public readonly PortableRecipesContext _context;

    public LunchApiController(PortableRecipesContext context, IOptions<MailOptions> mailOptionsAccessor)
    {
      _context = context;
      _mailOptions = mailOptionsAccessor.Value;
    }

    public bool ApiTokenValid => RestrictToUserTypeAttribute.ApiToken != null &&
        HttpContext.Request.Headers["ApiToken"] == RestrictToUserTypeAttribute.ApiToken;

    
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Lunch_id}/Lunch_Recipess")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Recipes> GetLunch_Recipess(int Lunch_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Lunch : _context.Lunch;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Lunch_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token) // test
        return Enumerable.Empty<PortableRecipes.Models.Recipes>() // B
              .AsQueryable()
              .Select(PortableRecipes.Models.Recipes.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Recipes.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var editable_targets = ApiTokenValid ? _context.Recipes : (_context.Recipes);
      var can_edit_by_token = ApiTokenValid || true;
      return (from link in _context.Lunch_Recipes
              where link.LunchId == source.Id
              from target in allowed_targets
              where link.RecipesId == target.Id
              select target)
              .Select(PortableRecipes.Models.Recipes.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Recipes.WithoutImages, item => item);
    }

    [HttpGet("{Lunch_id}/Lunch_Recipess/{Recipes_id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Recipes GetLunch_RecipesById(int Lunch_id, int Recipes_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Lunch : _context.Lunch;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Lunch_id);
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return null;
      var allowed_targets = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var item = (from link in _context.Lunch_Recipes
              where link.LunchId == source.Id
              from target in allowed_targets
              where link.RecipesId == target.Id
              select target)
              .Select(PortableRecipes.Models.Recipes.FilterViewableAttributes(current_User, current_Admin))
              .FirstOrDefault(t => t.Id == Recipes_id);

      item = PortableRecipes.Models.Recipes.WithoutImages(item);
      return item;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Lunch_id}/unlinked/Lunch_Recipess")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Recipes> GetUnlinkedLunch_Recipess(int Lunch_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Lunch : _context.Lunch;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Lunch_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token) // test
        return Enumerable.Empty<PortableRecipes.Models.Recipes>() // C
              .AsQueryable()
              .Select(PortableRecipes.Models.Recipes.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Recipes.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var editable_targets = ApiTokenValid ? _context.Recipes : (_context.Recipes);
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.Lunch_Recipes.Any(link => link.LunchId == source.Id && link.RecipesId == target.Id) &&
              true
              select target)
              .Select(PortableRecipes.Models.Recipes.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Recipes.WithoutImages, item => item);
    }

    bool CanAdd_Lunch_Lunch_Recipess(Lunch source) {
      return true;
    }

    bool CanAdd_Recipes_Lunch_Recipess(Recipes target) {
      return true;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Lunch_id}/Lunch_Recipess_Recipes")]
    public IEnumerable<Recipes> CreateNewLunch_Recipes_Recipes(int Lunch_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Lunch : _context.Lunch;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Lunch_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        throw new Exception("Cannot create item in relation Lunch_Recipess");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Lunch_Lunch_Recipess(source) || !can_link_by_token)
        throw new Exception("Cannot add item to relation Lunch_Recipess");
      var new_target = new Recipes() { CreatedDate = DateTime.Now, Id = _context.Recipes.Max(i => i.Id) + 1 };
      _context.Recipes.Add(new_target);
      _context.SaveChanges();
      var link = new Lunch_Recipes() { Id = _context.Lunch_Recipes.Max(l => l.Id) + 1, LunchId = source.Id, RecipesId = new_target.Id };
      _context.Lunch_Recipes.Add(link);
      _context.SaveChanges();
      return new Recipes[] { new_target };
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Lunch_id}/Lunch_Recipess/{Recipes_id}")]
    public void LinkWithLunch_Recipes(int Lunch_id, int Recipes_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Lunch;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Lunch_id);
      var allowed_targets = _context.Recipes;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Recipes_id);
      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Lunch_Lunch_Recipess(source) || !can_link_by_token || !can_edit_source_by_token || !can_edit_target_by_token)
        throw new Exception("Cannot add item to relation Lunch_Recipess");
      if (!CanAdd_Recipes_Lunch_Recipess(target))
        throw new Exception("Cannot add item to relation Lunch_Recipess");
      var link = new Lunch_Recipes() { Id = _context.Lunch_Recipes.Max(i => i.Id) + 1, LunchId = source.Id, RecipesId = target.Id };
      _context.Lunch_Recipes.Add(link);
      _context.SaveChanges();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpDelete("{Lunch_id}/Lunch_Recipess/{Recipes_id}")]
    public void UnlinkFromLunch_Recipes(int Lunch_id, int Recipes_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Lunch;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Lunch_id);
      var allowed_targets = _context.Recipes;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Recipes_id);
      var link = _context.Lunch_Recipes.FirstOrDefault(l => l.LunchId == source.Id && l.RecipesId == target.Id);

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
    public ItemWithEditable<Lunch> GetById(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Lunch : _context.Lunch;
      var editable_items = ApiTokenValid ? _context.Lunch : _context.Lunch;
      var item = PortableRecipes.Models.Lunch.FilterViewableAttributesLocal(current_User, current_Admin)(allowed_items.FirstOrDefault(e => e.Id == id));
      item = PortableRecipes.Models.Lunch.WithoutImages(item);
      return new ItemWithEditable<Lunch>() {
        Item = item,
        Editable = editable_items.Any(e => e.Id == item.Id) };
    }
    

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public Lunch Create()
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var can_create_by_token = ApiTokenValid || true;
      if (!can_create_by_token)
        throw new Exception("Unauthorized create attempt");
      var item = new Lunch() { CreatedDate = DateTime.Now, Id = _context.Meal.Max(i => i.Id) + 1 };
      _context.Lunch.Add(PortableRecipes.Models.Lunch.FilterViewableAttributesLocal(current_User, current_Admin)(item));
      _context.SaveChanges();
      item = PortableRecipes.Models.Lunch.WithoutImages(item);
      return item;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPut]
    [ValidateAntiForgeryToken]
    public void Update([FromBody] Lunch item)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Lunch : _context.Lunch;
      if (!allowed_items.Any(i => i.Id == item.Id)) return;
      var new_item = item;
      
      var can_edit_by_token = ApiTokenValid || true;
      if (item == null || !can_edit_by_token)
        throw new Exception("Unauthorized edit attempt");
      _context.Update(new_item);
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
      var allowed_items = ApiTokenValid ? _context.Lunch : _context.Lunch;
      var item = _context.Lunch.FirstOrDefault(e => e.Id == id);
      var can_delete_by_token = ApiTokenValid || true;
      if (item == null || !can_delete_by_token)
        throw new Exception("Unauthorized delete attempt");
      
      if (!allowed_items.Any(a => a.Id == item.Id)) throw new Exception("Unauthorized delete attempt");
      
      _context.Lunch.Remove(item);
      _context.SaveChanges();
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpGet]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Lunch> GetAll([FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Lunch : _context.Lunch;
      var editable_items = ApiTokenValid ? _context.Lunch : _context.Lunch;
      var can_edit_by_token = ApiTokenValid || true;
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true;
      return allowed_items
        .Select(PortableRecipes.Models.Lunch.FilterViewableAttributes(current_User, current_Admin))
        .Select(s => Tuple.Create(s, can_edit_by_token && editable_items.Any(es => es.Id == s.Id)))
        .Paginate(can_create_by_token, can_delete_by_token, false, page_index, page_size, PortableRecipes.Models.Lunch.WithoutImages, item => item);
    }

    


    
  }

  