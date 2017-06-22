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


  [Route("api/v1/Categories")]
  public class CategoriesApiController : Controller
  {
    private readonly MailOptions _mailOptions;
    public readonly PortableRecipesContext _context;

    public CategoriesApiController(PortableRecipesContext context, IOptions<MailOptions> mailOptionsAccessor)
    {
      _context = context;
      _mailOptions = mailOptionsAccessor.Value;
    }

    public bool ApiTokenValid => RestrictToUserTypeAttribute.ApiToken != null &&
        HttpContext.Request.Headers["ApiToken"] == RestrictToUserTypeAttribute.ApiToken;

    
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Categories_id}/Categories_Meals")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Meal> GetCategories_Meals(int Categories_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Categories : _context.Categories;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Categories_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token) // test
        return Enumerable.Empty<PortableRecipes.Models.Meal>() // B
              .AsQueryable()
              .Select(PortableRecipes.Models.Meal.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Meal.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.Meal : _context.Meal;
      var editable_targets = ApiTokenValid ? _context.Meal : (_context.Meal);
      var can_edit_by_token = ApiTokenValid || true;
      return (from link in _context.Categories_Meal
              where link.CategoriesId == source.Id
              from target in allowed_targets
              where link.MealId == target.Id
              select target)
              .Select(PortableRecipes.Models.Meal.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Meal.WithoutImages, item => item);
    }

    [HttpGet("{Categories_id}/Categories_Meals/{Meal_id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Meal GetCategories_MealById(int Categories_id, int Meal_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Categories : _context.Categories;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Categories_id);
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return null;
      var allowed_targets = ApiTokenValid ? _context.Meal : _context.Meal;
      var item = (from link in _context.Categories_Meal
              where link.CategoriesId == source.Id
              from target in allowed_targets
              where link.MealId == target.Id
              select target)
              .Select(PortableRecipes.Models.Meal.FilterViewableAttributes(current_User, current_Admin))
              .FirstOrDefault(t => t.Id == Meal_id);

      item = PortableRecipes.Models.Meal.WithoutImages(item);
      return item;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Categories_id}/unlinked/Categories_Meals")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Meal> GetUnlinkedCategories_Meals(int Categories_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Categories : _context.Categories;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Categories_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token) // test
        return Enumerable.Empty<PortableRecipes.Models.Meal>() // C
              .AsQueryable()
              .Select(PortableRecipes.Models.Meal.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Meal.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.Meal : _context.Meal;
      var editable_targets = ApiTokenValid ? _context.Meal : (_context.Meal);
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.Categories_Meal.Any(link => link.CategoriesId == source.Id && link.MealId == target.Id) &&
              (from link in _context.Categories_Meal
                where link.MealId == target.Id
                from s in _context.Categories
                where link.CategoriesId == s.Id
                select s).Count() < 1
              select target)
              .Select(PortableRecipes.Models.Meal.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Meal.WithoutImages, item => item);
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Categories_id}/unlinked/Categories_Meals/Lunch")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Lunch> GetUnlinkedCategories_Meals_Lunch(int Categories_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Categories : _context.Categories;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Categories_id);
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
      var editable_targets = ApiTokenValid ? _context.Meal : (_context.Meal);
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.Categories_Meal.Any(link => link.CategoriesId == source.Id && link.MealId == target.Id) &&
              (from link in _context.Categories_Meal
                where link.MealId == target.Id
                from s in _context.Categories
                where link.CategoriesId == s.Id
                select s).Count() < 1
              select target)
              .Select(PortableRecipes.Models.Lunch.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Lunch.WithoutImages, item => item);
    }


    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Categories_id}/unlinked/Categories_Meals/Dinner")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Dinner> GetUnlinkedCategories_Meals_Dinner(int Categories_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Categories : _context.Categories;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Categories_id);
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
      var editable_targets = ApiTokenValid ? _context.Meal : (_context.Meal);
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.Categories_Meal.Any(link => link.CategoriesId == source.Id && link.MealId == target.Id) &&
              (from link in _context.Categories_Meal
                where link.MealId == target.Id
                from s in _context.Categories
                where link.CategoriesId == s.Id
                select s).Count() < 1
              select target)
              .Select(PortableRecipes.Models.Dinner.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Dinner.WithoutImages, item => item);
    }


    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Categories_id}/unlinked/Categories_Meals/Breakfast")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Breakfast> GetUnlinkedCategories_Meals_Breakfast(int Categories_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Categories : _context.Categories;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Categories_id);
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
      var editable_targets = ApiTokenValid ? _context.Meal : (_context.Meal);
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.Categories_Meal.Any(link => link.CategoriesId == source.Id && link.MealId == target.Id) &&
              (from link in _context.Categories_Meal
                where link.MealId == target.Id
                from s in _context.Categories
                where link.CategoriesId == s.Id
                select s).Count() < 1
              select target)
              .Select(PortableRecipes.Models.Breakfast.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Breakfast.WithoutImages, item => item);
    }


    bool CanAdd_Categories_Categories_Meals(Categories source) {
      return true;
    }

    bool CanAdd_Meal_Categories_Meals(Meal target) {
      return (from link in _context.Categories_Meal
           where link.MealId == target.Id
           from source in _context.Categories
           where link.CategoriesId == source.Id
           select source).Count() < 1;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Categories_id}/Categories_Meals_Lunch")]
    public IEnumerable<Lunch> CreateNewCategories_Meal_Lunch(int Categories_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Categories : _context.Categories;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Categories_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        throw new Exception("Cannot create item in relation Categories_Meals");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Categories_Categories_Meals(source) || !can_link_by_token)
        throw new Exception("Cannot add item to relation Categories_Meals");
      var new_target = new Lunch() { CreatedDate = DateTime.Now, Id = _context.Meal.Max(i => i.Id) + 1 };
      _context.Lunch.Add(new_target);
      _context.SaveChanges();
      var link = new Categories_Meal() { Id = _context.Categories_Meal.Max(l => l.Id) + 1, CategoriesId = source.Id, MealId = new_target.Id };
      _context.Categories_Meal.Add(link);
      _context.SaveChanges();
      return new Lunch[] { new_target };
    }
[RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Categories_id}/Categories_Meals_Dinner")]
    public IEnumerable<Dinner> CreateNewCategories_Meal_Dinner(int Categories_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Categories : _context.Categories;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Categories_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        throw new Exception("Cannot create item in relation Categories_Meals");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Categories_Categories_Meals(source) || !can_link_by_token)
        throw new Exception("Cannot add item to relation Categories_Meals");
      var new_target = new Dinner() { CreatedDate = DateTime.Now, Id = _context.Meal.Max(i => i.Id) + 1 };
      _context.Dinner.Add(new_target);
      _context.SaveChanges();
      var link = new Categories_Meal() { Id = _context.Categories_Meal.Max(l => l.Id) + 1, CategoriesId = source.Id, MealId = new_target.Id };
      _context.Categories_Meal.Add(link);
      _context.SaveChanges();
      return new Dinner[] { new_target };
    }
[RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Categories_id}/Categories_Meals_Breakfast")]
    public IEnumerable<Breakfast> CreateNewCategories_Meal_Breakfast(int Categories_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Categories : _context.Categories;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Categories_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        throw new Exception("Cannot create item in relation Categories_Meals");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Categories_Categories_Meals(source) || !can_link_by_token)
        throw new Exception("Cannot add item to relation Categories_Meals");
      var new_target = new Breakfast() { CreatedDate = DateTime.Now, Id = _context.Meal.Max(i => i.Id) + 1 };
      _context.Breakfast.Add(new_target);
      _context.SaveChanges();
      var link = new Categories_Meal() { Id = _context.Categories_Meal.Max(l => l.Id) + 1, CategoriesId = source.Id, MealId = new_target.Id };
      _context.Categories_Meal.Add(link);
      _context.SaveChanges();
      return new Breakfast[] { new_target };
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Categories_id}/Categories_Meals/{Meal_id}")]
    public void LinkWithCategories_Meal(int Categories_id, int Meal_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Categories;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Categories_id);
      var allowed_targets = _context.Meal;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Meal_id);
      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Categories_Categories_Meals(source) || !can_link_by_token || !can_edit_source_by_token || !can_edit_target_by_token)
        throw new Exception("Cannot add item to relation Categories_Meals");
      if (!CanAdd_Meal_Categories_Meals(target))
        throw new Exception("Cannot add item to relation Categories_Meals");
      var link = new Categories_Meal() { Id = _context.Categories_Meal.Max(i => i.Id) + 1, CategoriesId = source.Id, MealId = target.Id };
      _context.Categories_Meal.Add(link);
      _context.SaveChanges();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpDelete("{Categories_id}/Categories_Meals/{Meal_id}")]
    public void UnlinkFromCategories_Meal(int Categories_id, int Meal_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Categories;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Categories_id);
      var allowed_targets = _context.Meal;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Meal_id);
      var link = _context.Categories_Meal.FirstOrDefault(l => l.CategoriesId == source.Id && l.MealId == target.Id);

      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_unlink_by_token = ApiTokenValid || true;
      if (!can_unlink_by_token || !can_edit_source_by_token || !can_edit_target_by_token) throw new Exception("Cannot remove item from relation Categories_Meals");
      _context.Categories_Meal.Remove(link);
      _context.SaveChanges();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Categories_id}/HomePage_Categoriess")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<HomePage> GetHomePage_Categoriess(int Categories_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Categories : _context.Categories;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Categories_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token) // test
        return Enumerable.Empty<PortableRecipes.Models.HomePage>() // B
              .AsQueryable()
              .Select(PortableRecipes.Models.HomePage.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.HomePage.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var editable_targets = ApiTokenValid ? _context.HomePage : (_context.HomePage);
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              select target)
              .Select(PortableRecipes.Models.HomePage.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.HomePage.WithoutImages, item => item);
    }

    [HttpGet("{Categories_id}/HomePage_Categoriess/{HomePage_id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public HomePage GetHomePage_CategoriesById(int Categories_id, int HomePage_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Categories : _context.Categories;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Categories_id);
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return null;
      var allowed_targets = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var item = (from target in allowed_targets
              select target)
              .Select(PortableRecipes.Models.HomePage.FilterViewableAttributes(current_User, current_Admin))
              .FirstOrDefault(t => t.Id == HomePage_id);

      item = PortableRecipes.Models.HomePage.WithoutImages(item);
      return item;
    }

    
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public ItemWithEditable<Categories> GetById(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Categories : _context.Categories;
      var editable_items = ApiTokenValid ? _context.Categories : _context.Categories;
      var item = PortableRecipes.Models.Categories.FilterViewableAttributesLocal(current_User, current_Admin)(allowed_items.FirstOrDefault(e => e.Id == id));
      item = PortableRecipes.Models.Categories.WithoutImages(item);
      return new ItemWithEditable<Categories>() {
        Item = item,
        Editable = editable_items.Any(e => e.Id == item.Id) };
    }
    

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public Categories Create()
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var can_create_by_token = ApiTokenValid || true;
      if (!can_create_by_token)
        throw new Exception("Unauthorized create attempt");
      var item = new Categories() { CreatedDate = DateTime.Now, Id = _context.Categories.Max(i => i.Id) + 1 };
      _context.Categories.Add(PortableRecipes.Models.Categories.FilterViewableAttributesLocal(current_User, current_Admin)(item));
      _context.SaveChanges();
      item = PortableRecipes.Models.Categories.WithoutImages(item);
      return item;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPut]
    [ValidateAntiForgeryToken]
    public void Update([FromBody] Categories item)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Categories : _context.Categories;
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
      var allowed_items = ApiTokenValid ? _context.Categories : _context.Categories;
      var item = _context.Categories.FirstOrDefault(e => e.Id == id);
      var can_delete_by_token = ApiTokenValid || true;
      if (item == null || !can_delete_by_token)
        throw new Exception("Unauthorized delete attempt");
      
      if (!allowed_items.Any(a => a.Id == item.Id)) throw new Exception("Unauthorized delete attempt");
      
      _context.Categories.Remove(item);
      _context.SaveChanges();
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpGet]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Categories> GetAll([FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Categories : _context.Categories;
      var editable_items = ApiTokenValid ? _context.Categories : _context.Categories;
      var can_edit_by_token = ApiTokenValid || true;
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true;
      return allowed_items
        .Select(PortableRecipes.Models.Categories.FilterViewableAttributes(current_User, current_Admin))
        .Select(s => Tuple.Create(s, can_edit_by_token && editable_items.Any(es => es.Id == s.Id)))
        .Paginate(can_create_by_token, can_delete_by_token, false, page_index, page_size, PortableRecipes.Models.Categories.WithoutImages, item => item);
    }

    


    
  }

  