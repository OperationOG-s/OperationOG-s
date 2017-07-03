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

    
    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpGet("{Meal_id}/Categorie_Meals")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Categorie> GetCategorie_Meals(int Meal_id, [FromQuery] int page_index, [FromQuery] int page_size = 25 )
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
        return Enumerable.Empty<PortableRecipes.Models.Categorie>() // B
              .AsQueryable()
              .Select(PortableRecipes.Models.Categorie.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Categorie.WithoutImages, item => item , null);
      var allowed_targets = ApiTokenValid ? _context.Categorie : _context.Categorie;
      var editable_targets = ApiTokenValid ? _context.Categorie : (current_Admin != null ? _context.Categorie : Enumerable.Empty<Categorie>().AsQueryable());
      var can_edit_by_token = ApiTokenValid || true;
      var items = (from link in _context.Categorie_Meal
              where link.MealId == source.Id
              from target in allowed_targets
              where link.CategorieId == target.Id
              select target).OrderBy(i => i.CreatedDate).AsQueryable();
      
      return items
              .Select(PortableRecipes.Models.Categorie.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Categorie.WithoutImages, item => item , null);
    }

    [HttpGet("{Meal_id}/Categorie_Meals/{Categorie_id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*Categorie*/ GetCategorie_MealById(int Meal_id, int Categorie_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Meal : _context.Meal;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Meal_id);
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return NotFound();
      var allowed_targets = ApiTokenValid ? _context.Categorie : _context.Categorie;
      var item = (from link in _context.Categorie_Meal
              where link.MealId == source.Id
              from target in allowed_targets
              where link.CategorieId == target.Id
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Categorie.FilterViewableAttributes(current_User, current_Admin))
              .FirstOrDefault(t => t.Id == Categorie_id);
      if (item == null) return NotFound();
      item = PortableRecipes.Models.Categorie.WithoutImages(item);
      return Ok(item);
    }

    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpGet("{Meal_id}/unlinked/Categorie_Meals")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Categorie> GetUnlinkedCategorie_Meals(int Meal_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
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
        return Enumerable.Empty<PortableRecipes.Models.Categorie>()
              .AsQueryable()
              .Select(PortableRecipes.Models.Categorie.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Categorie.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.Categorie : _context.Categorie;
      var editable_targets = ApiTokenValid ? _context.Categorie : (current_Admin != null ? _context.Categorie : Enumerable.Empty<Categorie>().AsQueryable());
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.Categorie_Meal.Any(link => link.MealId == source.Id && link.CategorieId == target.Id) &&
              true
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Categorie.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Categorie.WithoutImages, item => item);
    }
    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpGet("{Meal_id}/unlinked/Categorie_Meals/American")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<American> GetUnlinkedCategorie_Meals_American(int Meal_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
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
      var editable_targets = ApiTokenValid ? _context.Categorie : (current_Admin != null ? _context.Categorie : Enumerable.Empty<Categorie>().AsQueryable());
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.Categorie_Meal.Any(link => link.MealId == source.Id && link.CategorieId == target.Id) &&
              true
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.American.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.American.WithoutImages, item => item);
    }


    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpGet("{Meal_id}/unlinked/Categorie_Meals/Asian")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Asian> GetUnlinkedCategorie_Meals_Asian(int Meal_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
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
      var editable_targets = ApiTokenValid ? _context.Categorie : (current_Admin != null ? _context.Categorie : Enumerable.Empty<Categorie>().AsQueryable());
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.Categorie_Meal.Any(link => link.MealId == source.Id && link.CategorieId == target.Id) &&
              true
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Asian.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Asian.WithoutImages, item => item);
    }


    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpGet("{Meal_id}/unlinked/Categorie_Meals/Mediterranean")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Mediterranean> GetUnlinkedCategorie_Meals_Mediterranean(int Meal_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
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
      var editable_targets = ApiTokenValid ? _context.Categorie : (current_Admin != null ? _context.Categorie : Enumerable.Empty<Categorie>().AsQueryable());
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.Categorie_Meal.Any(link => link.MealId == source.Id && link.CategorieId == target.Id) &&
              true
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Mediterranean.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Mediterranean.WithoutImages, item => item);
    }


    bool CanAdd_Meal_Categorie_Meals(Meal source) {
      return (from link in _context.Categorie_Meal
           where link.MealId == source.Id
           from target in _context.Categorie
           where link.CategorieId == target.Id
           select target).Count() < 1;
    }

    bool CanAdd_Categorie_Categorie_Meals(Categorie target) {
      return true;
    }

    [RestrictToUserType(new string[] {"User", "Admin"})]
    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPost("{Meal_id}/Categorie_Meals_American")]
    public IActionResult /*IEnumerable<American>*/ CreateNewCategorie_Meal_American(int Meal_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Meal : _context.Meal;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Meal_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        return Unauthorized();
        // throw new Exception("Cannot create item in relation Categorie_Meals");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Meal_Categorie_Meals(source) || !can_link_by_token)
        return Unauthorized();
        //throw new Exception("Cannot add item to relation Categorie_Meals");
      var new_target = new American() { CreatedDate = DateTime.Now, Id = _context.Categorie.Max(i => i.Id) + 1 };
      _context.American.Add(new_target);
      _context.SaveChanges();
      var link = new Categorie_Meal() { Id = _context.Categorie_Meal.Max(l => l.Id) + 1, MealId = source.Id, CategorieId = new_target.Id };
      _context.Categorie_Meal.Add(link);
      _context.SaveChanges();
      return Ok(new American[] { new_target });
    }
[RestrictToUserType(new string[] {"User", "Admin"})]
    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPost("{Meal_id}/Categorie_Meals_Asian")]
    public IActionResult /*IEnumerable<Asian>*/ CreateNewCategorie_Meal_Asian(int Meal_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Meal : _context.Meal;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Meal_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        return Unauthorized();
        // throw new Exception("Cannot create item in relation Categorie_Meals");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Meal_Categorie_Meals(source) || !can_link_by_token)
        return Unauthorized();
        //throw new Exception("Cannot add item to relation Categorie_Meals");
      var new_target = new Asian() { CreatedDate = DateTime.Now, Id = _context.Categorie.Max(i => i.Id) + 1 };
      _context.Asian.Add(new_target);
      _context.SaveChanges();
      var link = new Categorie_Meal() { Id = _context.Categorie_Meal.Max(l => l.Id) + 1, MealId = source.Id, CategorieId = new_target.Id };
      _context.Categorie_Meal.Add(link);
      _context.SaveChanges();
      return Ok(new Asian[] { new_target });
    }
[RestrictToUserType(new string[] {"User", "Admin"})]
    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPost("{Meal_id}/Categorie_Meals_Mediterranean")]
    public IActionResult /*IEnumerable<Mediterranean>*/ CreateNewCategorie_Meal_Mediterranean(int Meal_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Meal : _context.Meal;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Meal_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        return Unauthorized();
        // throw new Exception("Cannot create item in relation Categorie_Meals");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Meal_Categorie_Meals(source) || !can_link_by_token)
        return Unauthorized();
        //throw new Exception("Cannot add item to relation Categorie_Meals");
      var new_target = new Mediterranean() { CreatedDate = DateTime.Now, Id = _context.Categorie.Max(i => i.Id) + 1 };
      _context.Mediterranean.Add(new_target);
      _context.SaveChanges();
      var link = new Categorie_Meal() { Id = _context.Categorie_Meal.Max(l => l.Id) + 1, MealId = source.Id, CategorieId = new_target.Id };
      _context.Categorie_Meal.Add(link);
      _context.SaveChanges();
      return Ok(new Mediterranean[] { new_target });
    }

    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpPost("{Meal_id}/Categorie_Meals/{Categorie_id}")]
    public IActionResult LinkWithCategorie_Meal(int Meal_id, int Categorie_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Meal;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Meal_id);
      var allowed_targets = _context.Categorie;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Categorie_id);
      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Meal_Categorie_Meals(source) || !can_link_by_token || !can_edit_source_by_token || !can_edit_target_by_token)
        return BadRequest();
        // throw new Exception("Cannot add item to relation Categorie_Meals");
      if (!CanAdd_Categorie_Categorie_Meals(target))
        return BadRequest();
        // throw new Exception("Cannot add item to relation Categorie_Meals");
      var link = new Categorie_Meal() { Id = _context.Categorie_Meal.Max(i => i.Id) + 1, MealId = source.Id, CategorieId = target.Id };
      _context.Categorie_Meal.Add(link);
      _context.SaveChanges();
      return Ok();
    }
    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpDelete("{Meal_id}/Categorie_Meals/{Categorie_id}")]
    public IActionResult UnlinkFromCategorie_Meal(int Meal_id, int Categorie_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Meal;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Meal_id);
      var allowed_targets = _context.Categorie;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Categorie_id);
      var link = _context.Categorie_Meal.FirstOrDefault(l => l.MealId == source.Id && l.CategorieId == target.Id);

      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_unlink_by_token = ApiTokenValid || true;
      if (!can_unlink_by_token || !can_edit_source_by_token || !can_edit_target_by_token) return Unauthorized(); // throw new Exception("Cannot remove item from relation Categorie_Meals");
      _context.Categorie_Meal.Remove(link);
      _context.SaveChanges();
      return Ok();
    }
    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpGet("{Meal_id}/Meal_Recipes")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Recipe> GetMeal_Recipes(int Meal_id, [FromQuery] int page_index, [FromQuery] int page_size = 25 )
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
        return Enumerable.Empty<PortableRecipes.Models.Recipe>() // B
              .AsQueryable()
              .Select(PortableRecipes.Models.Recipe.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Recipe.WithoutImages, item => item , null);
      var allowed_targets = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var editable_targets = ApiTokenValid ? _context.Recipe : (current_Admin != null ? _context.Recipe : Enumerable.Empty<Recipe>().AsQueryable());
      var can_edit_by_token = ApiTokenValid || true;
      var items = (from link in _context.Meal_Recipe
              where link.MealId == source.Id
              from target in allowed_targets
              where link.RecipeId == target.Id
              select target).OrderBy(i => i.CreatedDate).AsQueryable();
      
      return items
              .Select(PortableRecipes.Models.Recipe.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Recipe.WithoutImages, item => item , null);
    }

    [HttpGet("{Meal_id}/Meal_Recipes/{Recipe_id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*Recipe*/ GetMeal_RecipeById(int Meal_id, int Recipe_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Meal : _context.Meal;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Meal_id);
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return NotFound();
      var allowed_targets = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var item = (from link in _context.Meal_Recipe
              where link.MealId == source.Id
              from target in allowed_targets
              where link.RecipeId == target.Id
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Recipe.FilterViewableAttributes(current_User, current_Admin))
              .FirstOrDefault(t => t.Id == Recipe_id);
      if (item == null) return NotFound();
      item = PortableRecipes.Models.Recipe.WithoutImages(item);
      return Ok(item);
    }

    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpGet("{Meal_id}/unlinked/Meal_Recipes")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Recipe> GetUnlinkedMeal_Recipes(int Meal_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
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
        return Enumerable.Empty<PortableRecipes.Models.Recipe>()
              .AsQueryable()
              .Select(PortableRecipes.Models.Recipe.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Recipe.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var editable_targets = ApiTokenValid ? _context.Recipe : (current_Admin != null ? _context.Recipe : Enumerable.Empty<Recipe>().AsQueryable());
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.Meal_Recipe.Any(link => link.MealId == source.Id && link.RecipeId == target.Id) &&
              true
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Recipe.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Recipe.WithoutImages, item => item);
    }

    bool CanAdd_Meal_Meal_Recipes(Meal source) {
      return true;
    }

    bool CanAdd_Recipe_Meal_Recipes(Recipe target) {
      return true;
    }

    [RestrictToUserType(new string[] {"User", "Admin"})]
    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPost("{Meal_id}/Meal_Recipes_Recipe")]
    public IActionResult /*IEnumerable<Recipe>*/ CreateNewMeal_Recipe_Recipe(int Meal_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Meal : _context.Meal;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Meal_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        return Unauthorized();
        // throw new Exception("Cannot create item in relation Meal_Recipes");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Meal_Meal_Recipes(source) || !can_link_by_token)
        return Unauthorized();
        //throw new Exception("Cannot add item to relation Meal_Recipes");
      var new_target = new Recipe() { CreatedDate = DateTime.Now, Id = _context.Recipe.Max(i => i.Id) + 1 };
      _context.Recipe.Add(new_target);
      _context.SaveChanges();
      var link = new Meal_Recipe() { Id = _context.Meal_Recipe.Max(l => l.Id) + 1, MealId = source.Id, RecipeId = new_target.Id };
      _context.Meal_Recipe.Add(link);
      _context.SaveChanges();
      return Ok(new Recipe[] { new_target });
    }

    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpPost("{Meal_id}/Meal_Recipes/{Recipe_id}")]
    public IActionResult LinkWithMeal_Recipe(int Meal_id, int Recipe_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Meal;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Meal_id);
      var allowed_targets = _context.Recipe;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Recipe_id);
      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Meal_Meal_Recipes(source) || !can_link_by_token || !can_edit_source_by_token || !can_edit_target_by_token)
        return BadRequest();
        // throw new Exception("Cannot add item to relation Meal_Recipes");
      if (!CanAdd_Recipe_Meal_Recipes(target))
        return BadRequest();
        // throw new Exception("Cannot add item to relation Meal_Recipes");
      var link = new Meal_Recipe() { Id = _context.Meal_Recipe.Max(i => i.Id) + 1, MealId = source.Id, RecipeId = target.Id };
      _context.Meal_Recipe.Add(link);
      _context.SaveChanges();
      return Ok();
    }
    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpDelete("{Meal_id}/Meal_Recipes/{Recipe_id}")]
    public IActionResult UnlinkFromMeal_Recipe(int Meal_id, int Recipe_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Meal;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Meal_id);
      var allowed_targets = _context.Recipe;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Recipe_id);
      var link = _context.Meal_Recipe.FirstOrDefault(l => l.MealId == source.Id && l.RecipeId == target.Id);

      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_unlink_by_token = ApiTokenValid || true;
      if (!can_unlink_by_token || !can_edit_source_by_token || !can_edit_target_by_token) return Unauthorized(); // throw new Exception("Cannot remove item from relation Meal_Recipes");
      _context.Meal_Recipe.Remove(link);
      _context.SaveChanges();
      return Ok();
    }
    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpGet("{id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*ItemWithEditable<Meal>*/ GetById(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Meal : _context.Meal;
      var editable_items = ApiTokenValid ? _context.Meal : current_Admin != null ? _context.Meal : Enumerable.Empty<Meal>().AsQueryable();
      var item_full = allowed_items.FirstOrDefault(e => e.Id == id);
      if (item_full == null) return NotFound();
      var item = PortableRecipes.Models.Meal.FilterViewableAttributesLocal(current_User, current_Admin)(item_full);
      item = PortableRecipes.Models.Meal.WithoutImages(item);
      return Ok(new ItemWithEditable<Meal>() {
        Item = item,
        Editable = editable_items.Any(e => e.Id == item.Id) });
    }
    

    [RestrictToUserType(new string[] {"Admin"})]
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

    [RestrictToUserType(new string[] {"Admin"})]
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

    [RestrictToUserType(new string[] {"Admin"})]
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


    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpGet]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Meal> GetAll([FromQuery] int page_index, [FromQuery] int page_size = 25 )
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Meal : _context.Meal;
      var editable_items = ApiTokenValid ? _context.Meal : current_Admin != null ? _context.Meal : Enumerable.Empty<Meal>().AsQueryable();
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

  