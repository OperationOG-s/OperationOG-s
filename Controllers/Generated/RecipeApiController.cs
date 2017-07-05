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


  [Route("api/v1/Recipe")]
  public class RecipeApiController : Controller
  {
    private readonly MailOptions _mailOptions;
    public readonly PortableRecipesContext _context;
    private IHostingEnvironment env;

    public RecipeApiController(PortableRecipesContext context, IHostingEnvironment env, IOptions<MailOptions> mailOptionsAccessor)
    {
      _context = context;
      _mailOptions = mailOptionsAccessor.Value;
      this.env = env;
    }

    public bool ApiTokenValid => RestrictToUserTypeAttribute.ApiToken != null &&
        HttpContext.Request.Headers["ApiToken"] == RestrictToUserTypeAttribute.ApiToken;

    
    [RestrictToUserType(new string[] {"Admin", "User"})]
    [HttpGet("{Recipe_id}/User_Recipes")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<UserViewData> GetUser_Recipes(int Recipe_id, [FromQuery] int page_index, [FromQuery] int page_size = 25 )
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token) // test
        return Enumerable.Empty<PortableRecipes.Models.User>() // B
              .AsQueryable()
              .Select(PortableRecipes.Models.User.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.User.WithoutImages, item => UserViewData.FromUser(item) , null);
      var allowed_targets = ApiTokenValid ? _context.User : _context.User;
      var editable_targets = ApiTokenValid ? _context.User : (current_Admin != null || current_User != null ? (current_User != null ? (from _User in _context.User where _User.Id == current_User.Id
select _User) : _context.User) : Enumerable.Empty<User>().AsQueryable());
      var can_edit_by_token = ApiTokenValid || true;
      var items = (from link in _context.User_Recipe
              where link.RecipeId == source.Id
              from target in allowed_targets
              where link.UserId == target.Id
              select target).OrderBy(i => i.CreatedDate).AsQueryable();
      
      return items
              .Select(PortableRecipes.Models.User.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.User.WithoutImages, item => UserViewData.FromUser(item) , null);
    }

    [HttpGet("{Recipe_id}/User_Recipes/{User_id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*UserViewData*/ GetUser_RecipeById(int Recipe_id, int User_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return NotFound();
      var allowed_targets = ApiTokenValid ? _context.User : _context.User;
      var item = (from link in _context.User_Recipe
              where link.RecipeId == source.Id
              from target in allowed_targets
              where link.UserId == target.Id
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.User.FilterViewableAttributes(current_User, current_Admin))
              .FirstOrDefault(t => t.Id == User_id);
      if (item == null) return NotFound();
      item = PortableRecipes.Models.User.WithoutImages(item);
      return Ok(UserViewData.FromUser(item));
    }

    [RestrictToUserType(new string[] {"Admin", "User"})]
    [HttpGet("{Recipe_id}/unlinked/User_Recipes")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<UserViewData> GetUnlinkedUser_Recipes(int Recipe_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return Enumerable.Empty<PortableRecipes.Models.User>()
              .AsQueryable()
              .Select(PortableRecipes.Models.User.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.User.WithoutImages, item => UserViewData.FromUser(item));
      var allowed_targets = ApiTokenValid ? _context.User : _context.User;
      var editable_targets = ApiTokenValid ? _context.User : (current_Admin != null || current_User != null ? (current_User != null ? (from _User in _context.User where _User.Id == current_User.Id
select _User) : _context.User) : Enumerable.Empty<User>().AsQueryable());
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.User_Recipe.Any(link => link.RecipeId == source.Id && link.UserId == target.Id) &&
              true
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.User.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.User.WithoutImages, item => UserViewData.FromUser(item));
    }

    bool CanAdd_Recipe_User_Recipes(Recipe source) {
      return true;
    }

    bool CanAdd_User_User_Recipes(User target) {
      return true;
    }

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPost("{Recipe_id}/User_Recipes_User")]
    public IActionResult /*IEnumerable<UserViewData>*/ CreateNewUser_Recipe_User(int Recipe_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        return Unauthorized();
        // throw new Exception("Cannot create item in relation User_Recipes");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Recipe_User_Recipes(source) || !can_link_by_token)
        return Unauthorized();
        //throw new Exception("Cannot add item to relation User_Recipes");
      var new_target = new User() { CreatedDate = DateTime.Now, Id = _context.User.Max(i => i.Id) + 1 };
      _context.User.Add(new_target);
      _context.SaveChanges();
      var link = new User_Recipe() { Id = _context.User_Recipe.Max(l => l.Id) + 1, RecipeId = source.Id, UserId = new_target.Id };
      _context.User_Recipe.Add(link);
      _context.SaveChanges();
      return Ok(new UserViewData[] { UserViewData.FromUser(new_target) });
    }

    [RestrictToUserType(new string[] {"Admin", "User"})]
    [HttpPost("{Recipe_id}/User_Recipes/{User_id}")]
    public IActionResult LinkWithUser_Recipe(int Recipe_id, int User_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
      var allowed_targets = _context.User;
      var target = allowed_targets.FirstOrDefault(s => s.Id == User_id);
      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Recipe_User_Recipes(source) || !can_link_by_token || !can_edit_source_by_token || !can_edit_target_by_token)
        return BadRequest();
        // throw new Exception("Cannot add item to relation User_Recipes");
      if (!CanAdd_User_User_Recipes(target))
        return BadRequest();
        // throw new Exception("Cannot add item to relation User_Recipes");
      var link = new User_Recipe() { Id = _context.User_Recipe.Max(i => i.Id) + 1, RecipeId = source.Id, UserId = target.Id };
      _context.User_Recipe.Add(link);
      _context.SaveChanges();
      return Ok();
    }
    [RestrictToUserType(new string[] {"Admin", "User"})]
    [HttpDelete("{Recipe_id}/User_Recipes/{User_id}")]
    public IActionResult UnlinkFromUser_Recipe(int Recipe_id, int User_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
      var allowed_targets = _context.User;
      var target = allowed_targets.FirstOrDefault(s => s.Id == User_id);
      var link = _context.User_Recipe.FirstOrDefault(l => l.RecipeId == source.Id && l.UserId == target.Id);

      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_unlink_by_token = ApiTokenValid || true;
      if (!can_unlink_by_token || !can_edit_source_by_token || !can_edit_target_by_token) return Unauthorized(); // throw new Exception("Cannot remove item from relation User_Recipes");
      _context.User_Recipe.Remove(link);
      _context.SaveChanges();
      return Ok();
    }
    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpGet("{Recipe_id}/Recipe_Ratings")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Rating> GetRecipe_Ratings(int Recipe_id, [FromQuery] int page_index, [FromQuery] int page_size = 25 )
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token) // test
        return Enumerable.Empty<PortableRecipes.Models.Rating>() // B
              .AsQueryable()
              .Select(PortableRecipes.Models.Rating.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Rating.WithoutImages, item => item , null);
      var allowed_targets = ApiTokenValid ? _context.Rating : _context.Rating;
      var editable_targets = ApiTokenValid ? _context.Rating : (current_Admin != null ? _context.Rating : Enumerable.Empty<Rating>().AsQueryable());
      var can_edit_by_token = ApiTokenValid || true;
      var items = (from link in _context.Recipe_Rating
              where link.RecipeId == source.Id
              from target in allowed_targets
              where link.RatingId == target.Id
              select target).OrderBy(i => i.CreatedDate).AsQueryable();
      
      return items
              .Select(PortableRecipes.Models.Rating.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Rating.WithoutImages, item => item , null);
    }

    [HttpGet("{Recipe_id}/Recipe_Ratings/{Rating_id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*Rating*/ GetRecipe_RatingById(int Recipe_id, int Rating_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return NotFound();
      var allowed_targets = ApiTokenValid ? _context.Rating : _context.Rating;
      var item = (from link in _context.Recipe_Rating
              where link.RecipeId == source.Id
              from target in allowed_targets
              where link.RatingId == target.Id
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Rating.FilterViewableAttributes(current_User, current_Admin))
              .FirstOrDefault(t => t.Id == Rating_id);
      if (item == null) return NotFound();
      item = PortableRecipes.Models.Rating.WithoutImages(item);
      return Ok(item);
    }

    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpGet("{Recipe_id}/unlinked/Recipe_Ratings")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Rating> GetUnlinkedRecipe_Ratings(int Recipe_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return Enumerable.Empty<PortableRecipes.Models.Rating>()
              .AsQueryable()
              .Select(PortableRecipes.Models.Rating.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Rating.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.Rating : _context.Rating;
      var editable_targets = ApiTokenValid ? _context.Rating : (current_Admin != null ? _context.Rating : Enumerable.Empty<Rating>().AsQueryable());
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.Recipe_Rating.Any(link => link.RecipeId == source.Id && link.RatingId == target.Id) &&
              (from link in _context.Recipe_Rating
                where link.RatingId == target.Id
                from s in _context.Recipe
                where link.RecipeId == s.Id
                select s).Count() < 1
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Rating.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Rating.WithoutImages, item => item);
    }

    bool CanAdd_Recipe_Recipe_Ratings(Recipe source) {
      return true;
    }

    bool CanAdd_Rating_Recipe_Ratings(Rating target) {
      return (from link in _context.Recipe_Rating
           where link.RatingId == target.Id
           from source in _context.Recipe
           where link.RecipeId == source.Id
           select source).Count() < 1;
    }

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPost("{Recipe_id}/Recipe_Ratings_Rating")]
    public IActionResult /*IEnumerable<Rating>*/ CreateNewRecipe_Rating_Rating(int Recipe_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        return Unauthorized();
        // throw new Exception("Cannot create item in relation Recipe_Ratings");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Recipe_Recipe_Ratings(source) || !can_link_by_token)
        return Unauthorized();
        //throw new Exception("Cannot add item to relation Recipe_Ratings");
      var new_target = new Rating() { CreatedDate = DateTime.Now, Id = _context.Rating.Max(i => i.Id) + 1 };
      _context.Rating.Add(new_target);
      _context.SaveChanges();
      var link = new Recipe_Rating() { Id = _context.Recipe_Rating.Max(l => l.Id) + 1, RecipeId = source.Id, RatingId = new_target.Id };
      _context.Recipe_Rating.Add(link);
      _context.SaveChanges();
      return Ok(new Rating[] { new_target });
    }

    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpPost("{Recipe_id}/Recipe_Ratings/{Rating_id}")]
    public IActionResult LinkWithRecipe_Rating(int Recipe_id, int Rating_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
      var allowed_targets = _context.Rating;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Rating_id);
      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Recipe_Recipe_Ratings(source) || !can_link_by_token || !can_edit_source_by_token || !can_edit_target_by_token)
        return BadRequest();
        // throw new Exception("Cannot add item to relation Recipe_Ratings");
      if (!CanAdd_Rating_Recipe_Ratings(target))
        return BadRequest();
        // throw new Exception("Cannot add item to relation Recipe_Ratings");
      var link = new Recipe_Rating() { Id = _context.Recipe_Rating.Max(i => i.Id) + 1, RecipeId = source.Id, RatingId = target.Id };
      _context.Recipe_Rating.Add(link);
      _context.SaveChanges();
      return Ok();
    }
    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpDelete("{Recipe_id}/Recipe_Ratings/{Rating_id}")]
    public IActionResult UnlinkFromRecipe_Rating(int Recipe_id, int Rating_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
      var allowed_targets = _context.Rating;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Rating_id);
      var link = _context.Recipe_Rating.FirstOrDefault(l => l.RecipeId == source.Id && l.RatingId == target.Id);

      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_unlink_by_token = ApiTokenValid || true;
      if (!can_unlink_by_token || !can_edit_source_by_token || !can_edit_target_by_token) return Unauthorized(); // throw new Exception("Cannot remove item from relation Recipe_Ratings");
      _context.Recipe_Rating.Remove(link);
      _context.SaveChanges();
      return Ok();
    }
    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpGet("{Recipe_id}/Meal_Recipes")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Meal> GetMeal_Recipes(int Recipe_id, [FromQuery] int page_index, [FromQuery] int page_size = 25 )
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
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
      var items = (from link in _context.Meal_Recipe
              where link.RecipeId == source.Id
              from target in allowed_targets
              where link.MealId == target.Id
              select target).OrderBy(i => i.CreatedDate).AsQueryable();
      
      return items
              .Select(PortableRecipes.Models.Meal.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Meal.WithoutImages, item => item , null);
    }

    [HttpGet("{Recipe_id}/Meal_Recipes/{Meal_id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*Meal*/ GetMeal_RecipeById(int Recipe_id, int Meal_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return NotFound();
      var allowed_targets = ApiTokenValid ? _context.Meal : _context.Meal;
      var item = (from link in _context.Meal_Recipe
              where link.RecipeId == source.Id
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
    [HttpGet("{Recipe_id}/unlinked/Meal_Recipes")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Meal> GetUnlinkedMeal_Recipes(int Recipe_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
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
              where !_context.Meal_Recipe.Any(link => link.RecipeId == source.Id && link.MealId == target.Id) &&
              true
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Meal.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Meal.WithoutImages, item => item);
    }
    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpGet("{Recipe_id}/unlinked/Meal_Recipes/Lunch")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Lunch> GetUnlinkedMeal_Recipes_Lunch(int Recipe_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
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
              where !_context.Meal_Recipe.Any(link => link.RecipeId == source.Id && link.MealId == target.Id) &&
              true
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Lunch.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Lunch.WithoutImages, item => item);
    }


    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpGet("{Recipe_id}/unlinked/Meal_Recipes/Dinner")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Dinner> GetUnlinkedMeal_Recipes_Dinner(int Recipe_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
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
              where !_context.Meal_Recipe.Any(link => link.RecipeId == source.Id && link.MealId == target.Id) &&
              true
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Dinner.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Dinner.WithoutImages, item => item);
    }


    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpGet("{Recipe_id}/unlinked/Meal_Recipes/Breakfast")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Breakfast> GetUnlinkedMeal_Recipes_Breakfast(int Recipe_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
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
              where !_context.Meal_Recipe.Any(link => link.RecipeId == source.Id && link.MealId == target.Id) &&
              true
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Breakfast.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Breakfast.WithoutImages, item => item);
    }


    bool CanAdd_Recipe_Meal_Recipes(Recipe source) {
      return true;
    }

    bool CanAdd_Meal_Meal_Recipes(Meal target) {
      return true;
    }

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPost("{Recipe_id}/Meal_Recipes_Lunch")]
    public IActionResult /*IEnumerable<Lunch>*/ CreateNewMeal_Recipe_Lunch(int Recipe_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        return Unauthorized();
        // throw new Exception("Cannot create item in relation Meal_Recipes");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Recipe_Meal_Recipes(source) || !can_link_by_token)
        return Unauthorized();
        //throw new Exception("Cannot add item to relation Meal_Recipes");
      var new_target = new Lunch() { CreatedDate = DateTime.Now, Id = _context.Meal.Max(i => i.Id) + 1 };
      _context.Lunch.Add(new_target);
      _context.SaveChanges();
      var link = new Meal_Recipe() { Id = _context.Meal_Recipe.Max(l => l.Id) + 1, RecipeId = source.Id, MealId = new_target.Id };
      _context.Meal_Recipe.Add(link);
      _context.SaveChanges();
      return Ok(new Lunch[] { new_target });
    }
[RestrictToUserType(new string[] {"Admin"})]
    [HttpPost("{Recipe_id}/Meal_Recipes_Dinner")]
    public IActionResult /*IEnumerable<Dinner>*/ CreateNewMeal_Recipe_Dinner(int Recipe_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        return Unauthorized();
        // throw new Exception("Cannot create item in relation Meal_Recipes");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Recipe_Meal_Recipes(source) || !can_link_by_token)
        return Unauthorized();
        //throw new Exception("Cannot add item to relation Meal_Recipes");
      var new_target = new Dinner() { CreatedDate = DateTime.Now, Id = _context.Meal.Max(i => i.Id) + 1 };
      _context.Dinner.Add(new_target);
      _context.SaveChanges();
      var link = new Meal_Recipe() { Id = _context.Meal_Recipe.Max(l => l.Id) + 1, RecipeId = source.Id, MealId = new_target.Id };
      _context.Meal_Recipe.Add(link);
      _context.SaveChanges();
      return Ok(new Dinner[] { new_target });
    }
[RestrictToUserType(new string[] {"Admin"})]
    [HttpPost("{Recipe_id}/Meal_Recipes_Breakfast")]
    public IActionResult /*IEnumerable<Breakfast>*/ CreateNewMeal_Recipe_Breakfast(int Recipe_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        return Unauthorized();
        // throw new Exception("Cannot create item in relation Meal_Recipes");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Recipe_Meal_Recipes(source) || !can_link_by_token)
        return Unauthorized();
        //throw new Exception("Cannot add item to relation Meal_Recipes");
      var new_target = new Breakfast() { CreatedDate = DateTime.Now, Id = _context.Meal.Max(i => i.Id) + 1 };
      _context.Breakfast.Add(new_target);
      _context.SaveChanges();
      var link = new Meal_Recipe() { Id = _context.Meal_Recipe.Max(l => l.Id) + 1, RecipeId = source.Id, MealId = new_target.Id };
      _context.Meal_Recipe.Add(link);
      _context.SaveChanges();
      return Ok(new Breakfast[] { new_target });
    }

    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpPost("{Recipe_id}/Meal_Recipes/{Meal_id}")]
    public IActionResult LinkWithMeal_Recipe(int Recipe_id, int Meal_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
      var allowed_targets = _context.Meal;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Meal_id);
      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Recipe_Meal_Recipes(source) || !can_link_by_token || !can_edit_source_by_token || !can_edit_target_by_token)
        return BadRequest();
        // throw new Exception("Cannot add item to relation Meal_Recipes");
      if (!CanAdd_Meal_Meal_Recipes(target))
        return BadRequest();
        // throw new Exception("Cannot add item to relation Meal_Recipes");
      var link = new Meal_Recipe() { Id = _context.Meal_Recipe.Max(i => i.Id) + 1, RecipeId = source.Id, MealId = target.Id };
      _context.Meal_Recipe.Add(link);
      _context.SaveChanges();
      return Ok();
    }
    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpDelete("{Recipe_id}/Meal_Recipes/{Meal_id}")]
    public IActionResult UnlinkFromMeal_Recipe(int Recipe_id, int Meal_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
      var allowed_targets = _context.Meal;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Meal_id);
      var link = _context.Meal_Recipe.FirstOrDefault(l => l.RecipeId == source.Id && l.MealId == target.Id);

      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_unlink_by_token = ApiTokenValid || true;
      if (!can_unlink_by_token || !can_edit_source_by_token || !can_edit_target_by_token) return Unauthorized(); // throw new Exception("Cannot remove item from relation Meal_Recipes");
      _context.Meal_Recipe.Remove(link);
      _context.SaveChanges();
      return Ok();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Recipe_id}/Categorie_Recipes")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Categorie> GetCategorie_Recipes(int Recipe_id, [FromQuery] int page_index, [FromQuery] int page_size = 25 )
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
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
      var items = (from link in _context.Categorie_Recipe
              where link.RecipeId == source.Id
              from target in allowed_targets
              where link.CategorieId == target.Id
              select target).OrderBy(i => i.CreatedDate).AsQueryable();
      
      return items
              .Select(PortableRecipes.Models.Categorie.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Categorie.WithoutImages, item => item , null);
    }

    [HttpGet("{Recipe_id}/Categorie_Recipes/{Categorie_id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*Categorie*/ GetCategorie_RecipeById(int Recipe_id, int Categorie_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return NotFound();
      var allowed_targets = ApiTokenValid ? _context.Categorie : _context.Categorie;
      var item = (from link in _context.Categorie_Recipe
              where link.RecipeId == source.Id
              from target in allowed_targets
              where link.CategorieId == target.Id
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Categorie.FilterViewableAttributes(current_User, current_Admin))
              .FirstOrDefault(t => t.Id == Categorie_id);
      if (item == null) return NotFound();
      item = PortableRecipes.Models.Categorie.WithoutImages(item);
      return Ok(item);
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Recipe_id}/unlinked/Categorie_Recipes")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Categorie> GetUnlinkedCategorie_Recipes(int Recipe_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
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
              where !_context.Categorie_Recipe.Any(link => link.RecipeId == source.Id && link.CategorieId == target.Id) &&
              true
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Categorie.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Categorie.WithoutImages, item => item);
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Recipe_id}/unlinked/Categorie_Recipes/American")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<American> GetUnlinkedCategorie_Recipes_American(int Recipe_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
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
              where !_context.Categorie_Recipe.Any(link => link.RecipeId == source.Id && link.CategorieId == target.Id) &&
              true
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.American.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.American.WithoutImages, item => item);
    }


    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Recipe_id}/unlinked/Categorie_Recipes/Asian")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Asian> GetUnlinkedCategorie_Recipes_Asian(int Recipe_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
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
              where !_context.Categorie_Recipe.Any(link => link.RecipeId == source.Id && link.CategorieId == target.Id) &&
              true
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Asian.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Asian.WithoutImages, item => item);
    }


    [RestrictToUserType(new string[] {"User", "Admin"})]
    [HttpGet("{Recipe_id}/unlinked/Categorie_Recipes/Mediterranean")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Mediterranean> GetUnlinkedCategorie_Recipes_Mediterranean(int Recipe_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
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
              where !_context.Categorie_Recipe.Any(link => link.RecipeId == source.Id && link.CategorieId == target.Id) &&
              true
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Mediterranean.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Mediterranean.WithoutImages, item => item);
    }


    bool CanAdd_Recipe_Categorie_Recipes(Recipe source) {
      return true;
    }

    bool CanAdd_Categorie_Categorie_Recipes(Categorie target) {
      return true;
    }

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPost("{Recipe_id}/Categorie_Recipes_American")]
    public IActionResult /*IEnumerable<American>*/ CreateNewCategorie_Recipe_American(int Recipe_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        return Unauthorized();
        // throw new Exception("Cannot create item in relation Categorie_Recipes");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Recipe_Categorie_Recipes(source) || !can_link_by_token)
        return Unauthorized();
        //throw new Exception("Cannot add item to relation Categorie_Recipes");
      var new_target = new American() { CreatedDate = DateTime.Now, Id = _context.Categorie.Max(i => i.Id) + 1 };
      _context.American.Add(new_target);
      _context.SaveChanges();
      var link = new Categorie_Recipe() { Id = _context.Categorie_Recipe.Max(l => l.Id) + 1, RecipeId = source.Id, CategorieId = new_target.Id };
      _context.Categorie_Recipe.Add(link);
      _context.SaveChanges();
      return Ok(new American[] { new_target });
    }
[RestrictToUserType(new string[] {"Admin"})]
    [HttpPost("{Recipe_id}/Categorie_Recipes_Asian")]
    public IActionResult /*IEnumerable<Asian>*/ CreateNewCategorie_Recipe_Asian(int Recipe_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        return Unauthorized();
        // throw new Exception("Cannot create item in relation Categorie_Recipes");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Recipe_Categorie_Recipes(source) || !can_link_by_token)
        return Unauthorized();
        //throw new Exception("Cannot add item to relation Categorie_Recipes");
      var new_target = new Asian() { CreatedDate = DateTime.Now, Id = _context.Categorie.Max(i => i.Id) + 1 };
      _context.Asian.Add(new_target);
      _context.SaveChanges();
      var link = new Categorie_Recipe() { Id = _context.Categorie_Recipe.Max(l => l.Id) + 1, RecipeId = source.Id, CategorieId = new_target.Id };
      _context.Categorie_Recipe.Add(link);
      _context.SaveChanges();
      return Ok(new Asian[] { new_target });
    }
[RestrictToUserType(new string[] {"Admin"})]
    [HttpPost("{Recipe_id}/Categorie_Recipes_Mediterranean")]
    public IActionResult /*IEnumerable<Mediterranean>*/ CreateNewCategorie_Recipe_Mediterranean(int Recipe_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        return Unauthorized();
        // throw new Exception("Cannot create item in relation Categorie_Recipes");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Recipe_Categorie_Recipes(source) || !can_link_by_token)
        return Unauthorized();
        //throw new Exception("Cannot add item to relation Categorie_Recipes");
      var new_target = new Mediterranean() { CreatedDate = DateTime.Now, Id = _context.Categorie.Max(i => i.Id) + 1 };
      _context.Mediterranean.Add(new_target);
      _context.SaveChanges();
      var link = new Categorie_Recipe() { Id = _context.Categorie_Recipe.Max(l => l.Id) + 1, RecipeId = source.Id, CategorieId = new_target.Id };
      _context.Categorie_Recipe.Add(link);
      _context.SaveChanges();
      return Ok(new Mediterranean[] { new_target });
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Recipe_id}/Categorie_Recipes/{Categorie_id}")]
    public IActionResult LinkWithCategorie_Recipe(int Recipe_id, int Categorie_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
      var allowed_targets = _context.Categorie;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Categorie_id);
      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Recipe_Categorie_Recipes(source) || !can_link_by_token || !can_edit_source_by_token || !can_edit_target_by_token)
        return BadRequest();
        // throw new Exception("Cannot add item to relation Categorie_Recipes");
      if (!CanAdd_Categorie_Categorie_Recipes(target))
        return BadRequest();
        // throw new Exception("Cannot add item to relation Categorie_Recipes");
      var link = new Categorie_Recipe() { Id = _context.Categorie_Recipe.Max(i => i.Id) + 1, RecipeId = source.Id, CategorieId = target.Id };
      _context.Categorie_Recipe.Add(link);
      _context.SaveChanges();
      return Ok();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpDelete("{Recipe_id}/Categorie_Recipes/{Categorie_id}")]
    public IActionResult UnlinkFromCategorie_Recipe(int Recipe_id, int Categorie_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Recipe;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipe_id);
      var allowed_targets = _context.Categorie;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Categorie_id);
      var link = _context.Categorie_Recipe.FirstOrDefault(l => l.RecipeId == source.Id && l.CategorieId == target.Id);

      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_unlink_by_token = ApiTokenValid || true;
      if (!can_unlink_by_token || !can_edit_source_by_token || !can_edit_target_by_token) return Unauthorized(); // throw new Exception("Cannot remove item from relation Categorie_Recipes");
      _context.Categorie_Recipe.Remove(link);
      _context.SaveChanges();
      return Ok();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*ItemWithEditable<Recipe>*/ GetById(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var editable_items = ApiTokenValid ? _context.Recipe : current_Admin != null ? _context.Recipe : Enumerable.Empty<Recipe>().AsQueryable();
      var item_full = allowed_items.FirstOrDefault(e => e.Id == id);
      if (item_full == null) return NotFound();
      var item = PortableRecipes.Models.Recipe.FilterViewableAttributesLocal(current_User, current_Admin)(item_full);
      item = PortableRecipes.Models.Recipe.WithoutImages(item);
      return Ok(new ItemWithEditable<Recipe>() {
        Item = item,
        Editable = editable_items.Any(e => e.Id == item.Id) });
    }
    
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{id}/Picture")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*Container<string>*/ GetPictureById(int id)
    {
var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var full_item = allowed_items.FirstOrDefault(e => e.Id == id);
      if (full_item == null) return NotFound();
      var item = PortableRecipes.Models.Recipe.FilterViewableAttributesLocal(current_User, current_Admin)(full_item);
      return Ok(new Container<string> { Content = item.Picture });
    }

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPut("{id}/Picture")]
    [ValidateAntiForgeryToken]
    public void ChangePicture(int id, [FromBody] Container<string> Picture)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Recipe : _context.Recipe;
      if (!allowed_items.Any(i => i.Id == id)) return;
      var item = new Recipe() { Id = id, Picture = Picture.Content };
      _context.Recipe.Update(item);
      
      _context.Entry(item).Property(x => x.Name).IsModified = false;
      _context.Entry(item).Property(x => x.Ingredients).IsModified = false;
      _context.Entry(item).Property(x => x.Description).IsModified = false;
      _context.Entry(item).Property(x => x.PreparationTime).IsModified = false;
      _context.Entry(item).Property(x => x.CreatedDate).IsModified = false;
      _context.Entry(item).Property(x => x.Picture).IsModified = true;
      _context.SaveChanges();
    }

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult /*Recipe*/ Create()
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var can_create_by_token = ApiTokenValid || true;
      if (!can_create_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized create attempt");
      var item = new Recipe() { CreatedDate = DateTime.Now, Id = _context.Recipe.Max(i => i.Id) + 1 };
      _context.Recipe.Add(PortableRecipes.Models.Recipe.FilterViewableAttributesLocal(current_User, current_Admin)(item));
      _context.SaveChanges();
      item = PortableRecipes.Models.Recipe.WithoutImages(item);
      return Ok(item);
    }

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPut]
    [ValidateAntiForgeryToken]
    public IActionResult Update([FromBody] Recipe item)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Recipe : _context.Recipe;
      if (!allowed_items.Any(i => i.Id == item.Id)) return Unauthorized();
      var new_item = item;
      
      var can_edit_by_token = ApiTokenValid || true;
      if (item == null || !can_edit_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized edit attempt");
      _context.Update(new_item);
      _context.Entry(new_item).Property(x => x.Picture).IsModified = false;
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
      var allowed_items = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var item = _context.Recipe.FirstOrDefault(e => e.Id == id);
      var can_delete_by_token = ApiTokenValid || true;
      if (item == null || !can_delete_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized delete attempt");
      
      if (!allowed_items.Any(a => a.Id == item.Id)) return Unauthorized(); // throw new Exception("Unauthorized delete attempt");
      
      

      _context.Recipe.Remove(item);
      _context.SaveChanges();
      return Ok();
    }


    [RestrictToUserType(new string[] {"*"})]
    [HttpGet]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Recipe> GetAll([FromQuery] int page_index, [FromQuery] int page_size = 25 )
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Recipe : _context.Recipe;
      var editable_items = ApiTokenValid ? _context.Recipe : current_Admin != null ? _context.Recipe : Enumerable.Empty<Recipe>().AsQueryable();
      var can_edit_by_token = ApiTokenValid || true;
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true;
      var items = allowed_items.OrderBy(i => i.CreatedDate).AsQueryable();
      
      return items
        .Select(PortableRecipes.Models.Recipe.FilterViewableAttributes(current_User, current_Admin))
        .Select(s => Tuple.Create(s, can_edit_by_token && editable_items.Any(es => es.Id == s.Id)))
        .Paginate(can_create_by_token, can_delete_by_token, false, page_index, page_size, PortableRecipes.Models.Recipe.WithoutImages, item => item , null );
    }

    


    
  }

  