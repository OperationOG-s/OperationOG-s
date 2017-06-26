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


  [Route("api/v1/Categorie")]
  public class CategorieApiController : Controller
  {
    private readonly MailOptions _mailOptions;
    public readonly PortableRecipesContext _context;
    private IHostingEnvironment env;

    public CategorieApiController(PortableRecipesContext context, IHostingEnvironment env, IOptions<MailOptions> mailOptionsAccessor)
    {
      _context = context;
      _mailOptions = mailOptionsAccessor.Value;
      this.env = env;
    }

    public bool ApiTokenValid => RestrictToUserTypeAttribute.ApiToken != null &&
        HttpContext.Request.Headers["ApiToken"] == RestrictToUserTypeAttribute.ApiToken;

    
    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpGet("{Categorie_id}/Categorie_Meals")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Meal> GetCategorie_Meals(int Categorie_id, [FromQuery] int page_index, [FromQuery] int page_size = 25 )
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Categorie : _context.Categorie;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Categorie_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token) // test
        return Enumerable.Empty<PortableRecipes.Models.Meal>() // B
              .AsQueryable()
              .Select(PortableRecipes.Models.Meal.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Meal.WithoutImages, item => item , null);
      var allowed_targets = ApiTokenValid ? _context.Meal : _context.Meal;
      var editable_targets = ApiTokenValid ? _context.Meal : (current_Admin != null ? _context.Meal : Enumerable.Empty<Meal>().AsQueryable());
      var can_edit_by_token = ApiTokenValid || true;
      var items = (from link in _context.Categorie_Meal
              where link.CategorieId == source.Id
              from target in allowed_targets
              where link.MealId == target.Id
              select target).OrderBy(i => i.CreatedDate).AsQueryable();
      
      return items
              .Select(PortableRecipes.Models.Meal.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Meal.WithoutImages, item => item , null);
    }

    [HttpGet("{Categorie_id}/Categorie_Meals/{Meal_id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*Meal*/ GetCategorie_MealById(int Categorie_id, int Meal_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Categorie : _context.Categorie;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Categorie_id);
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return NotFound();
      var allowed_targets = ApiTokenValid ? _context.Meal : _context.Meal;
      var item = (from link in _context.Categorie_Meal
              where link.CategorieId == source.Id
              from target in allowed_targets
              where link.MealId == target.Id
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Meal.FilterViewableAttributes(current_User, current_Admin))
              .FirstOrDefault(t => t.Id == Meal_id);
      if (item == null) return NotFound();
      item = PortableRecipes.Models.Meal.WithoutImages(item);
      return Ok(item);
    }

    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpGet("{Categorie_id}/unlinked/Categorie_Meals")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Meal> GetUnlinkedCategorie_Meals(int Categorie_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Categorie : _context.Categorie;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Categorie_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return Enumerable.Empty<PortableRecipes.Models.Meal>()
              .AsQueryable()
              .Select(PortableRecipes.Models.Meal.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Meal.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.Meal : _context.Meal;
      var editable_targets = ApiTokenValid ? _context.Meal : (current_Admin != null ? _context.Meal : Enumerable.Empty<Meal>().AsQueryable());
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.Categorie_Meal.Any(link => link.CategorieId == source.Id && link.MealId == target.Id) &&
              (from link in _context.Categorie_Meal
                where link.MealId == target.Id
                from s in _context.Categorie
                where link.CategorieId == s.Id
                select s).Count() < 1
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Meal.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Meal.WithoutImages, item => item);
    }
    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpGet("{Categorie_id}/unlinked/Categorie_Meals/Lunch")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Lunch> GetUnlinkedCategorie_Meals_Lunch(int Categorie_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Categorie : _context.Categorie;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Categorie_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token) // test
        return Enumerable.Empty<PortableRecipes.Models.Lunch>() // A
              .AsQueryable()
              .Select(PortableRecipes.Models.Lunch.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Lunch.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.Lunch : _context.Lunch;
      var editable_targets = ApiTokenValid ? _context.Meal : (current_Admin != null ? _context.Meal : Enumerable.Empty<Meal>().AsQueryable());
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.Categorie_Meal.Any(link => link.CategorieId == source.Id && link.MealId == target.Id) &&
              (from link in _context.Categorie_Meal
                where link.MealId == target.Id
                from s in _context.Categorie
                where link.CategorieId == s.Id
                select s).Count() < 1
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Lunch.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Lunch.WithoutImages, item => item);
    }


    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpGet("{Categorie_id}/unlinked/Categorie_Meals/Dinner")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Dinner> GetUnlinkedCategorie_Meals_Dinner(int Categorie_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Categorie : _context.Categorie;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Categorie_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token) // test
        return Enumerable.Empty<PortableRecipes.Models.Dinner>() // A
              .AsQueryable()
              .Select(PortableRecipes.Models.Dinner.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Dinner.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.Dinner : _context.Dinner;
      var editable_targets = ApiTokenValid ? _context.Meal : (current_Admin != null ? _context.Meal : Enumerable.Empty<Meal>().AsQueryable());
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.Categorie_Meal.Any(link => link.CategorieId == source.Id && link.MealId == target.Id) &&
              (from link in _context.Categorie_Meal
                where link.MealId == target.Id
                from s in _context.Categorie
                where link.CategorieId == s.Id
                select s).Count() < 1
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Dinner.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Dinner.WithoutImages, item => item);
    }


    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpGet("{Categorie_id}/unlinked/Categorie_Meals/Breakfast")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Breakfast> GetUnlinkedCategorie_Meals_Breakfast(int Categorie_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Categorie : _context.Categorie;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Categorie_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token) // test
        return Enumerable.Empty<PortableRecipes.Models.Breakfast>() // A
              .AsQueryable()
              .Select(PortableRecipes.Models.Breakfast.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Breakfast.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.Breakfast : _context.Breakfast;
      var editable_targets = ApiTokenValid ? _context.Meal : (current_Admin != null ? _context.Meal : Enumerable.Empty<Meal>().AsQueryable());
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.Categorie_Meal.Any(link => link.CategorieId == source.Id && link.MealId == target.Id) &&
              (from link in _context.Categorie_Meal
                where link.MealId == target.Id
                from s in _context.Categorie
                where link.CategorieId == s.Id
                select s).Count() < 1
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Breakfast.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Breakfast.WithoutImages, item => item);
    }


    bool CanAdd_Categorie_Categorie_Meals(Categorie source) {
      return true;
    }

    bool CanAdd_Meal_Categorie_Meals(Meal target) {
      return (from link in _context.Categorie_Meal
           where link.MealId == target.Id
           from source in _context.Categorie
           where link.CategorieId == source.Id
           select source).Count() < 1;
    }

    [RestrictToUserType(new string[] {"User", "Admin"})]
    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPost("{Categorie_id}/Categorie_Meals_Lunch")]
    public IActionResult /*IEnumerable<Lunch>*/ CreateNewCategorie_Meal_Lunch(int Categorie_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Categorie : _context.Categorie;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Categorie_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        return Unauthorized();
        // throw new Exception("Cannot create item in relation Categorie_Meals");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Categorie_Categorie_Meals(source) || !can_link_by_token)
        return Unauthorized();
        //throw new Exception("Cannot add item to relation Categorie_Meals");
      var new_target = new Lunch() { CreatedDate = DateTime.Now, Id = _context.Meal.Max(i => i.Id) + 1 };
      _context.Lunch.Add(new_target);
      _context.SaveChanges();
      var link = new Categorie_Meal() { Id = _context.Categorie_Meal.Max(l => l.Id) + 1, CategorieId = source.Id, MealId = new_target.Id };
      _context.Categorie_Meal.Add(link);
      _context.SaveChanges();
      return Ok(new Lunch[] { new_target });
    }
[RestrictToUserType(new string[] {"User", "Admin"})]
    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPost("{Categorie_id}/Categorie_Meals_Dinner")]
    public IActionResult /*IEnumerable<Dinner>*/ CreateNewCategorie_Meal_Dinner(int Categorie_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Categorie : _context.Categorie;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Categorie_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        return Unauthorized();
        // throw new Exception("Cannot create item in relation Categorie_Meals");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Categorie_Categorie_Meals(source) || !can_link_by_token)
        return Unauthorized();
        //throw new Exception("Cannot add item to relation Categorie_Meals");
      var new_target = new Dinner() { CreatedDate = DateTime.Now, Id = _context.Meal.Max(i => i.Id) + 1 };
      _context.Dinner.Add(new_target);
      _context.SaveChanges();
      var link = new Categorie_Meal() { Id = _context.Categorie_Meal.Max(l => l.Id) + 1, CategorieId = source.Id, MealId = new_target.Id };
      _context.Categorie_Meal.Add(link);
      _context.SaveChanges();
      return Ok(new Dinner[] { new_target });
    }
[RestrictToUserType(new string[] {"User", "Admin"})]
    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPost("{Categorie_id}/Categorie_Meals_Breakfast")]
    public IActionResult /*IEnumerable<Breakfast>*/ CreateNewCategorie_Meal_Breakfast(int Categorie_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Categorie : _context.Categorie;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Categorie_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        return Unauthorized();
        // throw new Exception("Cannot create item in relation Categorie_Meals");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Categorie_Categorie_Meals(source) || !can_link_by_token)
        return Unauthorized();
        //throw new Exception("Cannot add item to relation Categorie_Meals");
      var new_target = new Breakfast() { CreatedDate = DateTime.Now, Id = _context.Meal.Max(i => i.Id) + 1 };
      _context.Breakfast.Add(new_target);
      _context.SaveChanges();
      var link = new Categorie_Meal() { Id = _context.Categorie_Meal.Max(l => l.Id) + 1, CategorieId = source.Id, MealId = new_target.Id };
      _context.Categorie_Meal.Add(link);
      _context.SaveChanges();
      return Ok(new Breakfast[] { new_target });
    }

    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpPost("{Categorie_id}/Categorie_Meals/{Meal_id}")]
    public IActionResult LinkWithCategorie_Meal(int Categorie_id, int Meal_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Categorie;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Categorie_id);
      var allowed_targets = _context.Meal;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Meal_id);
      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Categorie_Categorie_Meals(source) || !can_link_by_token || !can_edit_source_by_token || !can_edit_target_by_token)
        return BadRequest();
        // throw new Exception("Cannot add item to relation Categorie_Meals");
      if (!CanAdd_Meal_Categorie_Meals(target))
        return BadRequest();
        // throw new Exception("Cannot add item to relation Categorie_Meals");
      var link = new Categorie_Meal() { Id = _context.Categorie_Meal.Max(i => i.Id) + 1, CategorieId = source.Id, MealId = target.Id };
      _context.Categorie_Meal.Add(link);
      _context.SaveChanges();
      return Ok();
    }
    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpDelete("{Categorie_id}/Categorie_Meals/{Meal_id}")]
    public IActionResult UnlinkFromCategorie_Meal(int Categorie_id, int Meal_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Categorie;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Categorie_id);
      var allowed_targets = _context.Meal;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Meal_id);
      var link = _context.Categorie_Meal.FirstOrDefault(l => l.CategorieId == source.Id && l.MealId == target.Id);

      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_unlink_by_token = ApiTokenValid || true;
      if (!can_unlink_by_token || !can_edit_source_by_token || !can_edit_target_by_token) return Unauthorized(); // throw new Exception("Cannot remove item from relation Categorie_Meals");
      _context.Categorie_Meal.Remove(link);
      _context.SaveChanges();
      return Ok();
    }
    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpGet("{id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*ItemWithEditable<Categorie>*/ GetById(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Categorie : _context.Categorie;
      var editable_items = ApiTokenValid ? _context.Categorie : current_Admin != null ? _context.Categorie : Enumerable.Empty<Categorie>().AsQueryable();
      var item_full = allowed_items.FirstOrDefault(e => e.Id == id);
      if (item_full == null) return NotFound();
      var item = PortableRecipes.Models.Categorie.FilterViewableAttributesLocal(current_User, current_Admin)(item_full);
      item = PortableRecipes.Models.Categorie.WithoutImages(item);
      return Ok(new ItemWithEditable<Categorie>() {
        Item = item,
        Editable = editable_items.Any(e => e.Id == item.Id) });
    }
    

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult /*Categorie*/ Create()
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var can_create_by_token = ApiTokenValid || true;
      if (!can_create_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized create attempt");
      var item = new Categorie() { CreatedDate = DateTime.Now, Id = _context.Categorie.Max(i => i.Id) + 1 };
      _context.Categorie.Add(PortableRecipes.Models.Categorie.FilterViewableAttributesLocal(current_User, current_Admin)(item));
      _context.SaveChanges();
      item = PortableRecipes.Models.Categorie.WithoutImages(item);
      return Ok(item);
    }

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPut]
    [ValidateAntiForgeryToken]
    public IActionResult Update([FromBody] Categorie item)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Categorie : _context.Categorie;
      if (!allowed_items.Any(i => i.Id == item.Id)) return Unauthorized();
      var new_item = item;
      
      var can_edit_by_token = ApiTokenValid || true;
      if (item == null || !can_edit_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized edit attempt");
      _context.Update(new_item);
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
      var allowed_items = ApiTokenValid ? _context.Categorie : _context.Categorie;
      var item = _context.Categorie.FirstOrDefault(e => e.Id == id);
      var can_delete_by_token = ApiTokenValid || true;
      if (item == null || !can_delete_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized delete attempt");
      
      if (!allowed_items.Any(a => a.Id == item.Id)) return Unauthorized(); // throw new Exception("Unauthorized delete attempt");
      
      

      _context.Categorie.Remove(item);
      _context.SaveChanges();
      return Ok();
    }


    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpGet]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Categorie> GetAll([FromQuery] int page_index, [FromQuery] int page_size = 25 )
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Categorie : _context.Categorie;
      var editable_items = ApiTokenValid ? _context.Categorie : current_Admin != null ? _context.Categorie : Enumerable.Empty<Categorie>().AsQueryable();
      var can_edit_by_token = ApiTokenValid || true;
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true;
      var items = allowed_items.OrderBy(i => i.CreatedDate).AsQueryable();
      
      return items
        .Select(PortableRecipes.Models.Categorie.FilterViewableAttributes(current_User, current_Admin))
        .Select(s => Tuple.Create(s, can_edit_by_token && editable_items.Any(es => es.Id == s.Id)))
        .Paginate(can_create_by_token, can_delete_by_token, false, page_index, page_size, PortableRecipes.Models.Categorie.WithoutImages, item => item , null );
    }

    


    
  }

  