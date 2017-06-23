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


  [Route("api/v1/HomePage")]
  public class HomePageApiController : Controller
  {
    private readonly MailOptions _mailOptions;
    public readonly PortableRecipesContext _context;
    private IHostingEnvironment env;

    public HomePageApiController(PortableRecipesContext context, IHostingEnvironment env, IOptions<MailOptions> mailOptionsAccessor)
    {
      _context = context;
      _mailOptions = mailOptionsAccessor.Value;
      this.env = env;
    }

    public bool ApiTokenValid => RestrictToUserTypeAttribute.ApiToken != null &&
        HttpContext.Request.Headers["ApiToken"] == RestrictToUserTypeAttribute.ApiToken;

    
    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpGet("{HomePage_id}/HomePage_Recipes")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Recipe> GetHomePage_Recipes(int HomePage_id, [FromQuery] int page_index, [FromQuery] int page_size = 25 )
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var source = allowed_sources.FirstOrDefault(s => s.Id == HomePage_id);
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
      var items = (from target in allowed_targets
              select target).OrderBy(i => i.CreatedDate).AsQueryable();
      
      return items
              .Select(PortableRecipes.Models.Recipe.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Recipe.WithoutImages, item => item , null);
    }

    [HttpGet("{HomePage_id}/HomePage_Recipes/{Recipe_id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*Recipe*/ GetHomePage_RecipeById(int HomePage_id, int Recipe_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var source = allowed_sources.FirstOrDefault(s => s.Id == HomePage_id);
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return NotFound();
      var allowed_targets = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var item = (from target in allowed_targets
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Recipe.FilterViewableAttributes(current_User, current_Admin))
              .FirstOrDefault(t => t.Id == Recipe_id);
      if (item == null) return NotFound();
      item = PortableRecipes.Models.Recipe.WithoutImages(item);
      return Ok(item);
    }

    
    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpGet("{HomePage_id}/HomePage_Categories")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Categorie> GetHomePage_Categories(int HomePage_id, [FromQuery] int page_index, [FromQuery] int page_size = 25 )
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var source = allowed_sources.FirstOrDefault(s => s.Id == HomePage_id);
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
      var items = (from target in allowed_targets
              select target).OrderBy(i => i.CreatedDate).AsQueryable();
      
      return items
              .Select(PortableRecipes.Models.Categorie.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Categorie.WithoutImages, item => item , null);
    }

    [HttpGet("{HomePage_id}/HomePage_Categories/{Categorie_id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*Categorie*/ GetHomePage_CategorieById(int HomePage_id, int Categorie_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var source = allowed_sources.FirstOrDefault(s => s.Id == HomePage_id);
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return NotFound();
      var allowed_targets = ApiTokenValid ? _context.Categorie : _context.Categorie;
      var item = (from target in allowed_targets
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Categorie.FilterViewableAttributes(current_User, current_Admin))
              .FirstOrDefault(t => t.Id == Categorie_id);
      if (item == null) return NotFound();
      item = PortableRecipes.Models.Categorie.WithoutImages(item);
      return Ok(item);
    }

    
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*ItemWithEditable<HomePage>*/ GetById(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var editable_items = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var item_full = allowed_items.FirstOrDefault(e => e.Id == id);
      if (item_full == null) return NotFound();
      var item = PortableRecipes.Models.HomePage.FilterViewableAttributesLocal(current_User, current_Admin)(item_full);
      item = PortableRecipes.Models.HomePage.WithoutImages(item);
      return Ok(new ItemWithEditable<HomePage>() {
        Item = item,
        Editable = editable_items.Any(e => e.Id == item.Id) });
    }
    

    [RestrictToUserType(new string[] {})]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult /*HomePage*/ Create()
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var can_create_by_token = ApiTokenValid || true;
      if (!can_create_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized create attempt");
      var item = new HomePage() { CreatedDate = DateTime.Now, Id = _context.HomePage.Max(i => i.Id) + 1 };
      _context.HomePage.Add(PortableRecipes.Models.HomePage.FilterViewableAttributesLocal(current_User, current_Admin)(item));
      _context.SaveChanges();
      item = PortableRecipes.Models.HomePage.WithoutImages(item);
      return Ok(item);
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPut]
    [ValidateAntiForgeryToken]
    public IActionResult Update([FromBody] HomePage item)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.HomePage : _context.HomePage;
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

    [RestrictToUserType(new string[] {})]
    [HttpDelete("{id}")]
    [ValidateAntiForgeryToken]
    public IActionResult Delete(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var item = _context.HomePage.FirstOrDefault(e => e.Id == id);
      var can_delete_by_token = ApiTokenValid || true;
      if (item == null || !can_delete_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized delete attempt");
      
      if (!allowed_items.Any(a => a.Id == item.Id)) return Unauthorized(); // throw new Exception("Unauthorized delete attempt");
      
      

      _context.HomePage.Remove(item);
      _context.SaveChanges();
      return Ok();
    }


    [RestrictToUserType(new string[] {"*"})]
    [HttpGet]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<HomePage> GetAll([FromQuery] int page_index, [FromQuery] int page_size = 25 )
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var editable_items = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var can_edit_by_token = ApiTokenValid || true;
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true;
      var items = allowed_items.OrderBy(i => i.CreatedDate).AsQueryable();
      
      return items
        .Select(PortableRecipes.Models.HomePage.FilterViewableAttributes(current_User, current_Admin))
        .Select(s => Tuple.Create(s, can_edit_by_token && editable_items.Any(es => es.Id == s.Id)))
        .Paginate(can_create_by_token, can_delete_by_token, false, page_index, page_size, PortableRecipes.Models.HomePage.WithoutImages, item => item , null );
    }

    


    /*
    static public void CleanupNullRelations(PortableRecipesContext _context) {
    
      _context.Categorie_Meal.RemoveRange(_context.Categorie_Meal.Where(l =>
        l.CategorieId == null ||
        l.MealId == null ||
        !_context.Categorie.Any(s => s.Id == l.CategorieId) ||
        !_context.Meal.Any(s => s.Id == l.MealId)));
      _context.SaveChanges();
    

      _context.Categorie_Meal.RemoveRange(_context.Categorie_Meal.Where(l =>
        l.MealId == null ||
        l.CategorieId == null ||
        !_context.Meal.Any(s => s.Id == l.MealId) ||
        !_context.Categorie.Any(s => s.Id == l.CategorieId)));
      _context.SaveChanges();
    

      _context.User_Recipe.RemoveRange(_context.User_Recipe.Where(l =>
        l.UserId == null ||
        l.RecipeId == null ||
        !_context.User.Any(s => s.Id == l.UserId) ||
        !_context.Recipe.Any(s => s.Id == l.RecipeId)));
      _context.SaveChanges();
    

      _context.User_Recipe.RemoveRange(_context.User_Recipe.Where(l =>
        l.RecipeId == null ||
        l.UserId == null ||
        !_context.Recipe.Any(s => s.Id == l.RecipeId) ||
        !_context.User.Any(s => s.Id == l.UserId)));
      _context.SaveChanges();
    

      _context.Recipe_Rating.RemoveRange(_context.Recipe_Rating.Where(l =>
        l.RecipeId == null ||
        l.RatingId == null ||
        !_context.Recipe.Any(s => s.Id == l.RecipeId) ||
        !_context.Rating.Any(s => s.Id == l.RatingId)));
      _context.SaveChanges();
    

      _context.Recipe_Rating.RemoveRange(_context.Recipe_Rating.Where(l =>
        l.RatingId == null ||
        l.RecipeId == null ||
        !_context.Rating.Any(s => s.Id == l.RatingId) ||
        !_context.Recipe.Any(s => s.Id == l.RecipeId)));
      _context.SaveChanges();
    

      _context.Meal_Recipe.RemoveRange(_context.Meal_Recipe.Where(l =>
        l.MealId == null ||
        l.RecipeId == null ||
        !_context.Meal.Any(s => s.Id == l.MealId) ||
        !_context.Recipe.Any(s => s.Id == l.RecipeId)));
      _context.SaveChanges();
    

      _context.Meal_Recipe.RemoveRange(_context.Meal_Recipe.Where(l =>
        l.RecipeId == null ||
        l.MealId == null ||
        !_context.Recipe.Any(s => s.Id == l.RecipeId) ||
        !_context.Meal.Any(s => s.Id == l.MealId)));
      _context.SaveChanges();
    
    }
    */
    
  }

  