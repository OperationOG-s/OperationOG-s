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


  [Route("api/v1/Meal")]
  public class MealApiController : Controller
  {
    private readonly MailOptions _mailOptions;
    public readonly PortableRecipesContext _context;

    public MealApiController(PortableRecipesContext context, IOptions<MailOptions> mailOptionsAccessor)
    {
      _context = context;
      _mailOptions = mailOptionsAccessor.Value;
    }

    public bool ApiTokenValid => RestrictToUserTypeAttribute.ApiToken != null &&
        HttpContext.Request.Headers["ApiToken"] == RestrictToUserTypeAttribute.ApiToken;

    
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Meal_id}/Categories_Meals")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Categories> GetCategories_Meals(int Meal_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Meal : _context.Meal;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Meal_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token) // test
        return Enumerable.Empty<PortableRecipes.Models.Categories>() // B
              .AsQueryable()
              .Select(PortableRecipes.Models.Categories.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Categories.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.Categories : _context.Categories;
      var editable_targets = ApiTokenValid ? _context.Categories : (_context.Categories);
      var can_edit_by_token = ApiTokenValid || true;
      return (from link in _context.Categories_Meal
              where link.MealId == source.Id
              from target in allowed_targets
              where link.CategoriesId == target.Id
              select target)
              .Select(PortableRecipes.Models.Categories.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Categories.WithoutImages, item => item);
    }

    [HttpGet("{Meal_id}/Categories_Meals/{Categories_id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Categories GetCategories_MealById(int Meal_id, int Categories_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Meal : _context.Meal;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Meal_id);
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return null;
      var allowed_targets = ApiTokenValid ? _context.Categories : _context.Categories;
      var item = (from link in _context.Categories_Meal
              where link.MealId == source.Id
              from target in allowed_targets
              where link.CategoriesId == target.Id
              select target)
              .Select(PortableRecipes.Models.Categories.FilterViewableAttributes(current_User, current_Admin))
              .FirstOrDefault(t => t.Id == Categories_id);

      item = PortableRecipes.Models.Categories.WithoutImages(item);
      return item;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Meal_id}/unlinked/Categories_Meals")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Categories> GetUnlinkedCategories_Meals(int Meal_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Meal : _context.Meal;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Meal_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token) // test
        return Enumerable.Empty<PortableRecipes.Models.Categories>() // C
              .AsQueryable()
              .Select(PortableRecipes.Models.Categories.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Categories.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.Categories : _context.Categories;
      var editable_targets = ApiTokenValid ? _context.Categories : (_context.Categories);
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.Categories_Meal.Any(link => link.MealId == source.Id && link.CategoriesId == target.Id) &&
              true
              select target)
              .Select(PortableRecipes.Models.Categories.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Categories.WithoutImages, item => item);
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Meal_id}/unlinked/Categories_Meals/American")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<American> GetUnlinkedCategories_Meals_American(int Meal_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Meal : _context.Meal;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Meal_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token) // test
        return Enumerable.Empty<PortableRecipes.Models.American>() // A
              .AsQueryable()
              .Select(PortableRecipes.Models.American.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.American.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.American : _context.American;
      var editable_targets = ApiTokenValid ? _context.Categories : (_context.Categories);
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.Categories_Meal.Any(link => link.MealId == source.Id && link.CategoriesId == target.Id) &&
              true
              select target)
              .Select(PortableRecipes.Models.American.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.American.WithoutImages, item => item);
    }


    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Meal_id}/unlinked/Categories_Meals/Asian")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Asian> GetUnlinkedCategories_Meals_Asian(int Meal_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Meal : _context.Meal;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Meal_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token) // test
        return Enumerable.Empty<PortableRecipes.Models.Asian>() // A
              .AsQueryable()
              .Select(PortableRecipes.Models.Asian.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Asian.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.Asian : _context.Asian;
      var editable_targets = ApiTokenValid ? _context.Categories : (_context.Categories);
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.Categories_Meal.Any(link => link.MealId == source.Id && link.CategoriesId == target.Id) &&
              true
              select target)
              .Select(PortableRecipes.Models.Asian.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Asian.WithoutImages, item => item);
    }


    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Meal_id}/unlinked/Categories_Meals/Mediterranean")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Mediterranean> GetUnlinkedCategories_Meals_Mediterranean(int Meal_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Meal : _context.Meal;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Meal_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token) // test
        return Enumerable.Empty<PortableRecipes.Models.Mediterranean>() // A
              .AsQueryable()
              .Select(PortableRecipes.Models.Mediterranean.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Mediterranean.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.Mediterranean : _context.Mediterranean;
      var editable_targets = ApiTokenValid ? _context.Categories : (_context.Categories);
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.Categories_Meal.Any(link => link.MealId == source.Id && link.CategoriesId == target.Id) &&
              true
              select target)
              .Select(PortableRecipes.Models.Mediterranean.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Mediterranean.WithoutImages, item => item);
    }


    bool CanAdd_Meal_Categories_Meals(Meal source) {
      return (from link in _context.Categories_Meal
           where link.MealId == source.Id
           from target in _context.Categories
           where link.CategoriesId == target.Id
           select target).Count() < 1;
    }

    bool CanAdd_Categories_Categories_Meals(Categories target) {
      return true;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Meal_id}/Categories_Meals_American")]
    public IEnumerable<American> CreateNewCategories_Meal_American(int Meal_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Meal : _context.Meal;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Meal_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        throw new Exception("Cannot create item in relation Categories_Meals");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Meal_Categories_Meals(source) || !can_link_by_token)
        throw new Exception("Cannot add item to relation Categories_Meals");
      var new_target = new American() { CreatedDate = DateTime.Now, Id = _context.Categories.Max(i => i.Id) + 1 };
      _context.American.Add(new_target);
      _context.SaveChanges();
      var link = new Categories_Meal() { Id = _context.Categories_Meal.Max(l => l.Id) + 1, MealId = source.Id, CategoriesId = new_target.Id };
      _context.Categories_Meal.Add(link);
      _context.SaveChanges();
      return new American[] { new_target };
    }
[RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Meal_id}/Categories_Meals_Asian")]
    public IEnumerable<Asian> CreateNewCategories_Meal_Asian(int Meal_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Meal : _context.Meal;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Meal_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        throw new Exception("Cannot create item in relation Categories_Meals");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Meal_Categories_Meals(source) || !can_link_by_token)
        throw new Exception("Cannot add item to relation Categories_Meals");
      var new_target = new Asian() { CreatedDate = DateTime.Now, Id = _context.Categories.Max(i => i.Id) + 1 };
      _context.Asian.Add(new_target);
      _context.SaveChanges();
      var link = new Categories_Meal() { Id = _context.Categories_Meal.Max(l => l.Id) + 1, MealId = source.Id, CategoriesId = new_target.Id };
      _context.Categories_Meal.Add(link);
      _context.SaveChanges();
      return new Asian[] { new_target };
    }
[RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Meal_id}/Categories_Meals_Mediterranean")]
    public IEnumerable<Mediterranean> CreateNewCategories_Meal_Mediterranean(int Meal_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Meal : _context.Meal;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Meal_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        throw new Exception("Cannot create item in relation Categories_Meals");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Meal_Categories_Meals(source) || !can_link_by_token)
        throw new Exception("Cannot add item to relation Categories_Meals");
      var new_target = new Mediterranean() { CreatedDate = DateTime.Now, Id = _context.Categories.Max(i => i.Id) + 1 };
      _context.Mediterranean.Add(new_target);
      _context.SaveChanges();
      var link = new Categories_Meal() { Id = _context.Categories_Meal.Max(l => l.Id) + 1, MealId = source.Id, CategoriesId = new_target.Id };
      _context.Categories_Meal.Add(link);
      _context.SaveChanges();
      return new Mediterranean[] { new_target };
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Meal_id}/Categories_Meals/{Categories_id}")]
    public void LinkWithCategories_Meal(int Meal_id, int Categories_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Meal;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Meal_id);
      var allowed_targets = _context.Categories;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Categories_id);
      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Meal_Categories_Meals(source) || !can_link_by_token || !can_edit_source_by_token || !can_edit_target_by_token)
        throw new Exception("Cannot add item to relation Categories_Meals");
      if (!CanAdd_Categories_Categories_Meals(target))
        throw new Exception("Cannot add item to relation Categories_Meals");
      var link = new Categories_Meal() { Id = _context.Categories_Meal.Max(i => i.Id) + 1, MealId = source.Id, CategoriesId = target.Id };
      _context.Categories_Meal.Add(link);
      _context.SaveChanges();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpDelete("{Meal_id}/Categories_Meals/{Categories_id}")]
    public void UnlinkFromCategories_Meal(int Meal_id, int Categories_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Meal;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Meal_id);
      var allowed_targets = _context.Categories;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Categories_id);
      var link = _context.Categories_Meal.FirstOrDefault(l => l.MealId == source.Id && l.CategoriesId == target.Id);

      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_unlink_by_token = ApiTokenValid || true;
      if (!can_unlink_by_token || !can_edit_source_by_token || !can_edit_target_by_token) throw new Exception("Cannot remove item from relation Categories_Meals");
      _context.Categories_Meal.Remove(link);
      _context.SaveChanges();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public ItemWithEditable<Meal> GetById(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Meal : _context.Meal;
      var editable_items = ApiTokenValid ? _context.Meal : _context.Meal;
      var item = PortableRecipes.Models.Meal.FilterViewableAttributesLocal(current_User, current_Admin)(allowed_items.FirstOrDefault(e => e.Id == id));
      item = PortableRecipes.Models.Meal.WithoutImages(item);
      return new ItemWithEditable<Meal>() {
        Item = item,
        Editable = editable_items.Any(e => e.Id == item.Id) };
    }
    

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public Meal Create()
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var can_create_by_token = ApiTokenValid || true;
      if (!can_create_by_token)
        throw new Exception("Unauthorized create attempt");
      var item = new Meal() { CreatedDate = DateTime.Now, Id = _context.Meal.Max(i => i.Id) + 1 };
      _context.Meal.Add(PortableRecipes.Models.Meal.FilterViewableAttributesLocal(current_User, current_Admin)(item));
      _context.SaveChanges();
      item = PortableRecipes.Models.Meal.WithoutImages(item);
      return item;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPut]
    [ValidateAntiForgeryToken]
    public void Update([FromBody] Meal item)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Meal : _context.Meal;
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
      var allowed_items = ApiTokenValid ? _context.Meal : _context.Meal;
      var item = _context.Meal.FirstOrDefault(e => e.Id == id);
      var can_delete_by_token = ApiTokenValid || true;
      if (item == null || !can_delete_by_token)
        throw new Exception("Unauthorized delete attempt");
      
      if (!allowed_items.Any(a => a.Id == item.Id)) throw new Exception("Unauthorized delete attempt");
      
      _context.Meal.Remove(item);
      _context.SaveChanges();
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpGet]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Meal> GetAll([FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Meal : _context.Meal;
      var editable_items = ApiTokenValid ? _context.Meal : _context.Meal;
      var can_edit_by_token = ApiTokenValid || true;
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true;
      return allowed_items
        .Select(PortableRecipes.Models.Meal.FilterViewableAttributes(current_User, current_Admin))
        .Select(s => Tuple.Create(s, can_edit_by_token && editable_items.Any(es => es.Id == s.Id)))
        .Paginate(can_create_by_token, can_delete_by_token, false, page_index, page_size, PortableRecipes.Models.Meal.WithoutImages, item => item);
    }

    


    
  }

  