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


  [Route("api/v1/Meal")]
  public class MealApiController : Controller
  {
    private readonly MailOptions _mailOptions;
    public readonly PortableRecipesContext _context;
    private IHostingEnvironment env;

    public MealApiController(PortableRecipesContext context, IHostingEnvironment env, IOptions<MailOptions> mailOptionsAccessor)
    {
      _context = context;
      _mailOptions = mailOptionsAccessor.Value;
      this.env = env;
    }

    public bool ApiTokenValid => RestrictToUserTypeAttribute.ApiToken != null &&
        HttpContext.Request.Headers["ApiToken"] == RestrictToUserTypeAttribute.ApiToken;

    
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Meal_id}/Categories_Meals")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Categories> GetCategories_Meals(int Meal_id, [FromQuery] int page_index, [FromQuery] int page_size = 25 )
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
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Categories.WithoutImages, item => item , null);
      var allowed_targets = ApiTokenValid ? _context.Categories : _context.Categories;
      var editable_targets = ApiTokenValid ? _context.Categories : (_context.Categories);
      var can_edit_by_token = ApiTokenValid || true;
      var items = (from link in _context.Categories_Meal
              where link.MealId == source.Id
              from target in allowed_targets
              where link.CategoriesId == target.Id
              select target).OrderBy(i => i.CreatedDate).AsQueryable();
      
      return items
              .Select(PortableRecipes.Models.Categories.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Categories.WithoutImages, item => item , null);
    }

    [HttpGet("{Meal_id}/Categories_Meals/{Categories_id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*Categories*/ GetCategories_MealById(int Meal_id, int Categories_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Meal : _context.Meal;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Meal_id);
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return NotFound();
      var allowed_targets = ApiTokenValid ? _context.Categories : _context.Categories;
      var item = (from link in _context.Categories_Meal
              where link.MealId == source.Id
              from target in allowed_targets
              where link.CategoriesId == target.Id
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Categories.FilterViewableAttributes(current_User, current_Admin))
              .FirstOrDefault(t => t.Id == Categories_id);
      if (item == null) return NotFound();
      item = PortableRecipes.Models.Categories.WithoutImages(item);
      return Ok(item);
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
      if (source == null || !can_view_by_token)
        return Enumerable.Empty<PortableRecipes.Models.Categories>()
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
              select target).OrderBy(i => i.CreatedDate)
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
              select target).OrderBy(i => i.CreatedDate)
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
              select target).OrderBy(i => i.CreatedDate)
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
              select target).OrderBy(i => i.CreatedDate)
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
    public IActionResult /*IEnumerable<American>*/ CreateNewCategories_Meal_American(int Meal_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Meal : _context.Meal;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Meal_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        return Unauthorized();
        // throw new Exception("Cannot create item in relation Categories_Meals");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Meal_Categories_Meals(source) || !can_link_by_token)
        return Unauthorized();
        //throw new Exception("Cannot add item to relation Categories_Meals");
      var new_target = new American() { CreatedDate = DateTime.Now, Id = _context.Categories.Max(i => i.Id) + 1 };
      _context.American.Add(new_target);
      _context.SaveChanges();
      var link = new Categories_Meal() { Id = _context.Categories_Meal.Max(l => l.Id) + 1, MealId = source.Id, CategoriesId = new_target.Id };
      _context.Categories_Meal.Add(link);
      _context.SaveChanges();
      return Ok(new American[] { new_target });
    }
[RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Meal_id}/Categories_Meals_Asian")]
    public IActionResult /*IEnumerable<Asian>*/ CreateNewCategories_Meal_Asian(int Meal_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Meal : _context.Meal;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Meal_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        return Unauthorized();
        // throw new Exception("Cannot create item in relation Categories_Meals");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Meal_Categories_Meals(source) || !can_link_by_token)
        return Unauthorized();
        //throw new Exception("Cannot add item to relation Categories_Meals");
      var new_target = new Asian() { CreatedDate = DateTime.Now, Id = _context.Categories.Max(i => i.Id) + 1 };
      _context.Asian.Add(new_target);
      _context.SaveChanges();
      var link = new Categories_Meal() { Id = _context.Categories_Meal.Max(l => l.Id) + 1, MealId = source.Id, CategoriesId = new_target.Id };
      _context.Categories_Meal.Add(link);
      _context.SaveChanges();
      return Ok(new Asian[] { new_target });
    }
[RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Meal_id}/Categories_Meals_Mediterranean")]
    public IActionResult /*IEnumerable<Mediterranean>*/ CreateNewCategories_Meal_Mediterranean(int Meal_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Meal : _context.Meal;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Meal_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        return Unauthorized();
        // throw new Exception("Cannot create item in relation Categories_Meals");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Meal_Categories_Meals(source) || !can_link_by_token)
        return Unauthorized();
        //throw new Exception("Cannot add item to relation Categories_Meals");
      var new_target = new Mediterranean() { CreatedDate = DateTime.Now, Id = _context.Categories.Max(i => i.Id) + 1 };
      _context.Mediterranean.Add(new_target);
      _context.SaveChanges();
      var link = new Categories_Meal() { Id = _context.Categories_Meal.Max(l => l.Id) + 1, MealId = source.Id, CategoriesId = new_target.Id };
      _context.Categories_Meal.Add(link);
      _context.SaveChanges();
      return Ok(new Mediterranean[] { new_target });
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Meal_id}/Categories_Meals/{Categories_id}")]
    public IActionResult LinkWithCategories_Meal(int Meal_id, int Categories_id)
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
        return BadRequest();
        // throw new Exception("Cannot add item to relation Categories_Meals");
      if (!CanAdd_Categories_Categories_Meals(target))
        return BadRequest();
        // throw new Exception("Cannot add item to relation Categories_Meals");
      var link = new Categories_Meal() { Id = _context.Categories_Meal.Max(i => i.Id) + 1, MealId = source.Id, CategoriesId = target.Id };
      _context.Categories_Meal.Add(link);
      _context.SaveChanges();
      return Ok();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpDelete("{Meal_id}/Categories_Meals/{Categories_id}")]
    public IActionResult UnlinkFromCategories_Meal(int Meal_id, int Categories_id)
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
      if (!can_unlink_by_token || !can_edit_source_by_token || !can_edit_target_by_token) return Unauthorized(); // throw new Exception("Cannot remove item from relation Categories_Meals");
      _context.Categories_Meal.Remove(link);
      _context.SaveChanges();
      return Ok();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Meal_id}/Meal_Recipess")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Recipes> GetMeal_Recipess(int Meal_id, [FromQuery] int page_index, [FromQuery] int page_size = 25 )
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
        return Enumerable.Empty<PortableRecipes.Models.Recipes>() // B
              .AsQueryable()
              .Select(PortableRecipes.Models.Recipes.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Recipes.WithoutImages, item => item , null);
      var allowed_targets = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var editable_targets = ApiTokenValid ? _context.Recipes : (_context.Recipes);
      var can_edit_by_token = ApiTokenValid || true;
      var items = (from link in _context.Meal_Recipes
              where link.MealId == source.Id
              from target in allowed_targets
              where link.RecipesId == target.Id
              select target).OrderBy(i => i.CreatedDate).AsQueryable();
      
      return items
              .Select(PortableRecipes.Models.Recipes.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Recipes.WithoutImages, item => item , null);
    }

    [HttpGet("{Meal_id}/Meal_Recipess/{Recipes_id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*Recipes*/ GetMeal_RecipesById(int Meal_id, int Recipes_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Meal : _context.Meal;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Meal_id);
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return NotFound();
      var allowed_targets = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var item = (from link in _context.Meal_Recipes
              where link.MealId == source.Id
              from target in allowed_targets
              where link.RecipesId == target.Id
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Recipes.FilterViewableAttributes(current_User, current_Admin))
              .FirstOrDefault(t => t.Id == Recipes_id);
      if (item == null) return NotFound();
      item = PortableRecipes.Models.Recipes.WithoutImages(item);
      return Ok(item);
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Meal_id}/unlinked/Meal_Recipess")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Recipes> GetUnlinkedMeal_Recipess(int Meal_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
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
              where !_context.Meal_Recipes.Any(link => link.MealId == source.Id && link.RecipesId == target.Id) &&
              true
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Recipes.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Recipes.WithoutImages, item => item);
    }

    bool CanAdd_Meal_Meal_Recipess(Meal source) {
      return true;
    }

    bool CanAdd_Recipes_Meal_Recipess(Recipes target) {
      return true;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Meal_id}/Meal_Recipess_Recipes")]
    public IActionResult /*IEnumerable<Recipes>*/ CreateNewMeal_Recipes_Recipes(int Meal_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Meal : _context.Meal;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Meal_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        return Unauthorized();
        // throw new Exception("Cannot create item in relation Meal_Recipess");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Meal_Meal_Recipess(source) || !can_link_by_token)
        return Unauthorized();
        //throw new Exception("Cannot add item to relation Meal_Recipess");
      var new_target = new Recipes() { CreatedDate = DateTime.Now, Id = _context.Recipes.Max(i => i.Id) + 1 };
      _context.Recipes.Add(new_target);
      _context.SaveChanges();
      var link = new Meal_Recipes() { Id = _context.Meal_Recipes.Max(l => l.Id) + 1, MealId = source.Id, RecipesId = new_target.Id };
      _context.Meal_Recipes.Add(link);
      _context.SaveChanges();
      return Ok(new Recipes[] { new_target });
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Meal_id}/Meal_Recipess/{Recipes_id}")]
    public IActionResult LinkWithMeal_Recipes(int Meal_id, int Recipes_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Meal;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Meal_id);
      var allowed_targets = _context.Recipes;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Recipes_id);
      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Meal_Meal_Recipess(source) || !can_link_by_token || !can_edit_source_by_token || !can_edit_target_by_token)
        return BadRequest();
        // throw new Exception("Cannot add item to relation Meal_Recipess");
      if (!CanAdd_Recipes_Meal_Recipess(target))
        return BadRequest();
        // throw new Exception("Cannot add item to relation Meal_Recipess");
      var link = new Meal_Recipes() { Id = _context.Meal_Recipes.Max(i => i.Id) + 1, MealId = source.Id, RecipesId = target.Id };
      _context.Meal_Recipes.Add(link);
      _context.SaveChanges();
      return Ok();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpDelete("{Meal_id}/Meal_Recipess/{Recipes_id}")]
    public IActionResult UnlinkFromMeal_Recipes(int Meal_id, int Recipes_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Meal;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Meal_id);
      var allowed_targets = _context.Recipes;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Recipes_id);
      var link = _context.Meal_Recipes.FirstOrDefault(l => l.MealId == source.Id && l.RecipesId == target.Id);

      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_unlink_by_token = ApiTokenValid || true;
      if (!can_unlink_by_token || !can_edit_source_by_token || !can_edit_target_by_token) return Unauthorized(); // throw new Exception("Cannot remove item from relation Meal_Recipess");
      _context.Meal_Recipes.Remove(link);
      _context.SaveChanges();
      return Ok();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*ItemWithEditable<Meal>*/ GetById(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Meal : _context.Meal;
      var editable_items = ApiTokenValid ? _context.Meal : _context.Meal;
      var item_full = allowed_items.FirstOrDefault(e => e.Id == id);
      if (item_full == null) return NotFound();
      var item = PortableRecipes.Models.Meal.FilterViewableAttributesLocal(current_User, current_Admin)(item_full);
      item = PortableRecipes.Models.Meal.WithoutImages(item);
      return Ok(new ItemWithEditable<Meal>() {
        Item = item,
        Editable = editable_items.Any(e => e.Id == item.Id) });
    }
    

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult /*Meal*/ Create()
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var can_create_by_token = ApiTokenValid || true;
      if (!can_create_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized create attempt");
      var item = new Meal() { CreatedDate = DateTime.Now, Id = _context.Meal.Max(i => i.Id) + 1 };
      _context.Meal.Add(PortableRecipes.Models.Meal.FilterViewableAttributesLocal(current_User, current_Admin)(item));
      _context.SaveChanges();
      item = PortableRecipes.Models.Meal.WithoutImages(item);
      return Ok(item);
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPut]
    [ValidateAntiForgeryToken]
    public IActionResult Update([FromBody] Meal item)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Meal : _context.Meal;
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

    [RestrictToUserType(new string[] {"*"})]
    [HttpDelete("{id}")]
    [ValidateAntiForgeryToken]
    public IActionResult Delete(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Meal : _context.Meal;
      var item = _context.Meal.FirstOrDefault(e => e.Id == id);
      var can_delete_by_token = ApiTokenValid || true;
      if (item == null || !can_delete_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized delete attempt");
      
      if (!allowed_items.Any(a => a.Id == item.Id)) return Unauthorized(); // throw new Exception("Unauthorized delete attempt");
      
      

      _context.Meal.Remove(item);
      _context.SaveChanges();
      return Ok();
    }


    [RestrictToUserType(new string[] {"*"})]
    [HttpGet]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Meal> GetAll([FromQuery] int page_index, [FromQuery] int page_size = 25 )
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Meal : _context.Meal;
      var editable_items = ApiTokenValid ? _context.Meal : _context.Meal;
      var can_edit_by_token = ApiTokenValid || true;
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true;
      var items = allowed_items.OrderBy(i => i.CreatedDate).AsQueryable();
      
      return items
        .Select(PortableRecipes.Models.Meal.FilterViewableAttributes(current_User, current_Admin))
        .Select(s => Tuple.Create(s, can_edit_by_token && editable_items.Any(es => es.Id == s.Id)))
        .Paginate(can_create_by_token, can_delete_by_token, false, page_index, page_size, PortableRecipes.Models.Meal.WithoutImages, item => item , null );
    }

    


    
  }

  