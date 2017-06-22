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


  [Route("api/v1/HomePage")]
  public class HomePageApiController : Controller
  {
    private readonly MailOptions _mailOptions;
    public readonly PortableRecipesContext _context;

    public HomePageApiController(PortableRecipesContext context, IOptions<MailOptions> mailOptionsAccessor)
    {
      _context = context;
      _mailOptions = mailOptionsAccessor.Value;
    }

    public bool ApiTokenValid => RestrictToUserTypeAttribute.ApiToken != null &&
        HttpContext.Request.Headers["ApiToken"] == RestrictToUserTypeAttribute.ApiToken;

    
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{HomePage_id}/HomePage_Categoriess")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Categories> GetHomePage_Categoriess(int HomePage_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
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
        return Enumerable.Empty<PortableRecipes.Models.Categories>() // B
              .AsQueryable()
              .Select(PortableRecipes.Models.Categories.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Categories.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.Categories : _context.Categories;
      var editable_targets = ApiTokenValid ? _context.Categories : (_context.Categories);
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              select target)
              .Select(PortableRecipes.Models.Categories.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Categories.WithoutImages, item => item);
    }

    [HttpGet("{HomePage_id}/HomePage_Categoriess/{Categories_id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Categories GetHomePage_CategoriesById(int HomePage_id, int Categories_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var source = allowed_sources.FirstOrDefault(s => s.Id == HomePage_id);
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return null;
      var allowed_targets = ApiTokenValid ? _context.Categories : _context.Categories;
      var item = (from target in allowed_targets
              select target)
              .Select(PortableRecipes.Models.Categories.FilterViewableAttributes(current_User, current_Admin))
              .FirstOrDefault(t => t.Id == Categories_id);

      item = PortableRecipes.Models.Categories.WithoutImages(item);
      return item;
    }

    
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public ItemWithEditable<HomePage> GetById(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var editable_items = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var item = PortableRecipes.Models.HomePage.FilterViewableAttributesLocal(current_User, current_Admin)(allowed_items.FirstOrDefault(e => e.Id == id));
      item = PortableRecipes.Models.HomePage.WithoutImages(item);
      return new ItemWithEditable<HomePage>() {
        Item = item,
        Editable = editable_items.Any(e => e.Id == item.Id) };
    }
    

    [RestrictToUserType(new string[] {})]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public HomePage Create()
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var can_create_by_token = ApiTokenValid || true;
      if (!can_create_by_token)
        throw new Exception("Unauthorized create attempt");
      var item = new HomePage() { CreatedDate = DateTime.Now, Id = _context.HomePage.Max(i => i.Id) + 1 };
      _context.HomePage.Add(PortableRecipes.Models.HomePage.FilterViewableAttributesLocal(current_User, current_Admin)(item));
      _context.SaveChanges();
      item = PortableRecipes.Models.HomePage.WithoutImages(item);
      return item;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPut]
    [ValidateAntiForgeryToken]
    public void Update([FromBody] HomePage item)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.HomePage : _context.HomePage;
      if (!allowed_items.Any(i => i.Id == item.Id)) return;
      var new_item = item;
      
      var can_edit_by_token = ApiTokenValid || true;
      if (item == null || !can_edit_by_token)
        throw new Exception("Unauthorized edit attempt");
      _context.Update(new_item);
      _context.Entry(new_item).Property(x => x.CreatedDate).IsModified = false;
      _context.SaveChanges();
    }

    [RestrictToUserType(new string[] {})]
    [HttpDelete("{id}")]
    [ValidateAntiForgeryToken]
    public void Delete(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var item = _context.HomePage.FirstOrDefault(e => e.Id == id);
      var can_delete_by_token = ApiTokenValid || true;
      if (item == null || !can_delete_by_token)
        throw new Exception("Unauthorized delete attempt");
      
      if (!allowed_items.Any(a => a.Id == item.Id)) throw new Exception("Unauthorized delete attempt");
      
      _context.HomePage.Remove(item);
      _context.SaveChanges();
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpGet]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<HomePage> GetAll([FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var editable_items = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var can_edit_by_token = ApiTokenValid || true;
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true;
      return allowed_items
        .Select(PortableRecipes.Models.HomePage.FilterViewableAttributes(current_User, current_Admin))
        .Select(s => Tuple.Create(s, can_edit_by_token && editable_items.Any(es => es.Id == s.Id)))
        .Paginate(can_create_by_token, can_delete_by_token, false, page_index, page_size, PortableRecipes.Models.HomePage.WithoutImages, item => item);
    }

    


    /*
    static public void CleanupNullRelations(PortableRecipesContext _context) {
    
      _context.Categories_Meal.RemoveRange(_context.Categories_Meal.Where(l =>
        l.CategoriesId == null ||
        l.MealId == null ||
        !_context.Categories.Any(s => s.Id == l.CategoriesId) ||
        !_context.Meal.Any(s => s.Id == l.MealId)));
      _context.SaveChanges();
    

      _context.Categories_Meal.RemoveRange(_context.Categories_Meal.Where(l =>
        l.MealId == null ||
        l.CategoriesId == null ||
        !_context.Meal.Any(s => s.Id == l.MealId) ||
        !_context.Categories.Any(s => s.Id == l.CategoriesId)));
      _context.SaveChanges();
    

      _context.User_Recipes.RemoveRange(_context.User_Recipes.Where(l =>
        l.UserId == null ||
        l.RecipesId == null ||
        !_context.User.Any(s => s.Id == l.UserId) ||
        !_context.Recipes.Any(s => s.Id == l.RecipesId)));
      _context.SaveChanges();
    

      _context.User_Recipes.RemoveRange(_context.User_Recipes.Where(l =>
        l.RecipesId == null ||
        l.UserId == null ||
        !_context.Recipes.Any(s => s.Id == l.RecipesId) ||
        !_context.User.Any(s => s.Id == l.UserId)));
      _context.SaveChanges();
    

      _context.Dinner_Recipes.RemoveRange(_context.Dinner_Recipes.Where(l =>
        l.DinnerId == null ||
        l.RecipesId == null ||
        !_context.Dinner.Any(s => s.Id == l.DinnerId) ||
        !_context.Recipes.Any(s => s.Id == l.RecipesId)));
      _context.SaveChanges();
    

      _context.Dinner_Recipes.RemoveRange(_context.Dinner_Recipes.Where(l =>
        l.RecipesId == null ||
        l.DinnerId == null ||
        !_context.Recipes.Any(s => s.Id == l.RecipesId) ||
        !_context.Dinner.Any(s => s.Id == l.DinnerId)));
      _context.SaveChanges();
    

      _context.Breakfast_Recipes.RemoveRange(_context.Breakfast_Recipes.Where(l =>
        l.BreakfastId == null ||
        l.RecipesId == null ||
        !_context.Breakfast.Any(s => s.Id == l.BreakfastId) ||
        !_context.Recipes.Any(s => s.Id == l.RecipesId)));
      _context.SaveChanges();
    

      _context.Breakfast_Recipes.RemoveRange(_context.Breakfast_Recipes.Where(l =>
        l.RecipesId == null ||
        l.BreakfastId == null ||
        !_context.Recipes.Any(s => s.Id == l.RecipesId) ||
        !_context.Breakfast.Any(s => s.Id == l.BreakfastId)));
      _context.SaveChanges();
    

      _context.Lunch_Recipes.RemoveRange(_context.Lunch_Recipes.Where(l =>
        l.LunchId == null ||
        l.RecipesId == null ||
        !_context.Lunch.Any(s => s.Id == l.LunchId) ||
        !_context.Recipes.Any(s => s.Id == l.RecipesId)));
      _context.SaveChanges();
    

      _context.Lunch_Recipes.RemoveRange(_context.Lunch_Recipes.Where(l =>
        l.RecipesId == null ||
        l.LunchId == null ||
        !_context.Recipes.Any(s => s.Id == l.RecipesId) ||
        !_context.Lunch.Any(s => s.Id == l.LunchId)));
      _context.SaveChanges();
    
    }
    */
    
  }

  