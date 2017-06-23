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


  [Route("api/v1/Recipes")]
  public class RecipesApiController : Controller
  {
    private readonly MailOptions _mailOptions;
    public readonly PortableRecipesContext _context;
    private IHostingEnvironment env;

    public RecipesApiController(PortableRecipesContext context, IHostingEnvironment env, IOptions<MailOptions> mailOptionsAccessor)
    {
      _context = context;
      _mailOptions = mailOptionsAccessor.Value;
      this.env = env;
    }

    public bool ApiTokenValid => RestrictToUserTypeAttribute.ApiToken != null &&
        HttpContext.Request.Headers["ApiToken"] == RestrictToUserTypeAttribute.ApiToken;

    
    [RestrictToUserType(new string[] {"Admin", "User"})]
    [HttpGet("{Recipes_id}/User_Recipess")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<UserViewData> GetUser_Recipess(int Recipes_id, [FromQuery] int page_index, [FromQuery] int page_size = 25 )
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
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.User.WithoutImages, item => UserViewData.FromUser(item) , null);
      var allowed_targets = ApiTokenValid ? _context.User : _context.User;
      var editable_targets = ApiTokenValid ? _context.User : (current_Admin != null || current_User != null ? (current_User != null ? (from _User in _context.User where _User.Id == current_User.Id
select _User) : _context.User) : Enumerable.Empty<User>().AsQueryable());
      var can_edit_by_token = ApiTokenValid || true;
      var items = (from link in _context.User_Recipes
              where link.RecipesId == source.Id
              from target in allowed_targets
              where link.UserId == target.Id
              select target).OrderBy(i => i.CreatedDate).AsQueryable();
      
      return items
              .Select(PortableRecipes.Models.User.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.User.WithoutImages, item => UserViewData.FromUser(item) , null);
    }

    [HttpGet("{Recipes_id}/User_Recipess/{User_id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*UserViewData*/ GetUser_RecipesById(int Recipes_id, int User_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return NotFound();
      var allowed_targets = ApiTokenValid ? _context.User : _context.User;
      var item = (from link in _context.User_Recipes
              where link.RecipesId == source.Id
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
              where !_context.User_Recipes.Any(link => link.RecipesId == source.Id && link.UserId == target.Id) &&
              true
              select target).OrderBy(i => i.CreatedDate)
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
    public IActionResult /*IEnumerable<UserViewData>*/ CreateNewUser_Recipes_User(int Recipes_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        return Unauthorized();
        // throw new Exception("Cannot create item in relation User_Recipess");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Recipes_User_Recipess(source) || !can_link_by_token)
        return Unauthorized();
        //throw new Exception("Cannot add item to relation User_Recipess");
      var new_target = new User() { CreatedDate = DateTime.Now, Id = _context.User.Max(i => i.Id) + 1 };
      _context.User.Add(new_target);
      _context.SaveChanges();
      var link = new User_Recipes() { Id = _context.User_Recipes.Max(l => l.Id) + 1, RecipesId = source.Id, UserId = new_target.Id };
      _context.User_Recipes.Add(link);
      _context.SaveChanges();
      return Ok(new UserViewData[] { UserViewData.FromUser(new_target) });
    }

    [RestrictToUserType(new string[] {"Admin", "User"})]
    [HttpPost("{Recipes_id}/User_Recipess/{User_id}")]
    public IActionResult LinkWithUser_Recipes(int Recipes_id, int User_id)
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
        return BadRequest();
        // throw new Exception("Cannot add item to relation User_Recipess");
      if (!CanAdd_User_User_Recipess(target))
        return BadRequest();
        // throw new Exception("Cannot add item to relation User_Recipess");
      var link = new User_Recipes() { Id = _context.User_Recipes.Max(i => i.Id) + 1, RecipesId = source.Id, UserId = target.Id };
      _context.User_Recipes.Add(link);
      _context.SaveChanges();
      return Ok();
    }
    [RestrictToUserType(new string[] {"Admin", "User"})]
    [HttpDelete("{Recipes_id}/User_Recipess/{User_id}")]
    public IActionResult UnlinkFromUser_Recipes(int Recipes_id, int User_id)
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
      if (!can_unlink_by_token || !can_edit_source_by_token || !can_edit_target_by_token) return Unauthorized(); // throw new Exception("Cannot remove item from relation User_Recipess");
      _context.User_Recipes.Remove(link);
      _context.SaveChanges();
      return Ok();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Recipes_id}/Recipes_Ratings")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Rating> GetRecipes_Ratings(int Recipes_id, [FromQuery] int page_index, [FromQuery] int page_size = 25 )
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
        return Enumerable.Empty<PortableRecipes.Models.Rating>() // B
              .AsQueryable()
              .Select(PortableRecipes.Models.Rating.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Rating.WithoutImages, item => item , null);
      var allowed_targets = ApiTokenValid ? _context.Rating : _context.Rating;
      var editable_targets = ApiTokenValid ? _context.Rating : (_context.Rating);
      var can_edit_by_token = ApiTokenValid || true;
      var items = (from link in _context.Recipes_Rating
              where link.RecipesId == source.Id
              from target in allowed_targets
              where link.RatingId == target.Id
              select target).OrderBy(i => i.CreatedDate).AsQueryable();
      
      return items
              .Select(PortableRecipes.Models.Rating.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Rating.WithoutImages, item => item , null);
    }

    [HttpGet("{Recipes_id}/Recipes_Ratings/{Rating_id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*Rating*/ GetRecipes_RatingById(int Recipes_id, int Rating_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return NotFound();
      var allowed_targets = ApiTokenValid ? _context.Rating : _context.Rating;
      var item = (from link in _context.Recipes_Rating
              where link.RecipesId == source.Id
              from target in allowed_targets
              where link.RatingId == target.Id
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Rating.FilterViewableAttributes(current_User, current_Admin))
              .FirstOrDefault(t => t.Id == Rating_id);
      if (item == null) return NotFound();
      item = PortableRecipes.Models.Rating.WithoutImages(item);
      return Ok(item);
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Recipes_id}/unlinked/Recipes_Ratings")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Rating> GetUnlinkedRecipes_Ratings(int Recipes_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
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
      if (source == null || !can_view_by_token)
        return Enumerable.Empty<PortableRecipes.Models.Rating>()
              .AsQueryable()
              .Select(PortableRecipes.Models.Rating.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Rating.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.Rating : _context.Rating;
      var editable_targets = ApiTokenValid ? _context.Rating : (_context.Rating);
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.Recipes_Rating.Any(link => link.RecipesId == source.Id && link.RatingId == target.Id) &&
              (from link in _context.Recipes_Rating
                where link.RatingId == target.Id
                from s in _context.Recipes
                where link.RecipesId == s.Id
                select s).Count() < 1
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Rating.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Rating.WithoutImages, item => item);
    }

    bool CanAdd_Recipes_Recipes_Ratings(Recipes source) {
      return true;
    }

    bool CanAdd_Rating_Recipes_Ratings(Rating target) {
      return (from link in _context.Recipes_Rating
           where link.RatingId == target.Id
           from source in _context.Recipes
           where link.RecipesId == source.Id
           select source).Count() < 1;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Recipes_id}/Recipes_Ratings_Rating")]
    public IActionResult /*IEnumerable<Rating>*/ CreateNewRecipes_Rating_Rating(int Recipes_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        return Unauthorized();
        // throw new Exception("Cannot create item in relation Recipes_Ratings");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Recipes_Recipes_Ratings(source) || !can_link_by_token)
        return Unauthorized();
        //throw new Exception("Cannot add item to relation Recipes_Ratings");
      var new_target = new Rating() { CreatedDate = DateTime.Now, Id = _context.Rating.Max(i => i.Id) + 1 };
      _context.Rating.Add(new_target);
      _context.SaveChanges();
      var link = new Recipes_Rating() { Id = _context.Recipes_Rating.Max(l => l.Id) + 1, RecipesId = source.Id, RatingId = new_target.Id };
      _context.Recipes_Rating.Add(link);
      _context.SaveChanges();
      return Ok(new Rating[] { new_target });
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Recipes_id}/Recipes_Ratings/{Rating_id}")]
    public IActionResult LinkWithRecipes_Rating(int Recipes_id, int Rating_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var allowed_targets = _context.Rating;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Rating_id);
      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Recipes_Recipes_Ratings(source) || !can_link_by_token || !can_edit_source_by_token || !can_edit_target_by_token)
        return BadRequest();
        // throw new Exception("Cannot add item to relation Recipes_Ratings");
      if (!CanAdd_Rating_Recipes_Ratings(target))
        return BadRequest();
        // throw new Exception("Cannot add item to relation Recipes_Ratings");
      var link = new Recipes_Rating() { Id = _context.Recipes_Rating.Max(i => i.Id) + 1, RecipesId = source.Id, RatingId = target.Id };
      _context.Recipes_Rating.Add(link);
      _context.SaveChanges();
      return Ok();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpDelete("{Recipes_id}/Recipes_Ratings/{Rating_id}")]
    public IActionResult UnlinkFromRecipes_Rating(int Recipes_id, int Rating_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var allowed_targets = _context.Rating;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Rating_id);
      var link = _context.Recipes_Rating.FirstOrDefault(l => l.RecipesId == source.Id && l.RatingId == target.Id);

      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_unlink_by_token = ApiTokenValid || true;
      if (!can_unlink_by_token || !can_edit_source_by_token || !can_edit_target_by_token) return Unauthorized(); // throw new Exception("Cannot remove item from relation Recipes_Ratings");
      _context.Recipes_Rating.Remove(link);
      _context.SaveChanges();
      return Ok();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Recipes_id}/Meal_Recipess")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Meal> GetMeal_Recipess(int Recipes_id, [FromQuery] int page_index, [FromQuery] int page_size = 25 )
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
        return Enumerable.Empty<PortableRecipes.Models.Meal>() // B
              .AsQueryable()
              .Select(PortableRecipes.Models.Meal.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Meal.WithoutImages, item => item , null);
      var allowed_targets = ApiTokenValid ? _context.Meal : _context.Meal;
      var editable_targets = ApiTokenValid ? _context.Meal : (_context.Meal);
      var can_edit_by_token = ApiTokenValid || true;
      var items = (from link in _context.Meal_Recipes
              where link.RecipesId == source.Id
              from target in allowed_targets
              where link.MealId == target.Id
              select target).OrderBy(i => i.CreatedDate).AsQueryable();
      
      return items
              .Select(PortableRecipes.Models.Meal.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Meal.WithoutImages, item => item , null);
    }

    [HttpGet("{Recipes_id}/Meal_Recipess/{Meal_id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*Meal*/ GetMeal_RecipesById(int Recipes_id, int Meal_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return NotFound();
      var allowed_targets = ApiTokenValid ? _context.Meal : _context.Meal;
      var item = (from link in _context.Meal_Recipes
              where link.RecipesId == source.Id
              from target in allowed_targets
              where link.MealId == target.Id
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Meal.FilterViewableAttributes(current_User, current_Admin))
              .FirstOrDefault(t => t.Id == Meal_id);
      if (item == null) return NotFound();
      item = PortableRecipes.Models.Meal.WithoutImages(item);
      return Ok(item);
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Recipes_id}/unlinked/Meal_Recipess")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Meal> GetUnlinkedMeal_Recipess(int Recipes_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
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
      if (source == null || !can_view_by_token)
        return Enumerable.Empty<PortableRecipes.Models.Meal>()
              .AsQueryable()
              .Select(PortableRecipes.Models.Meal.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Meal.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.Meal : _context.Meal;
      var editable_targets = ApiTokenValid ? _context.Meal : (_context.Meal);
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.Meal_Recipes.Any(link => link.RecipesId == source.Id && link.MealId == target.Id) &&
              true
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Meal.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Meal.WithoutImages, item => item);
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Recipes_id}/unlinked/Meal_Recipess/Lunch")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Lunch> GetUnlinkedMeal_Recipess_Lunch(int Recipes_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
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
        return Enumerable.Empty<PortableRecipes.Models.Lunch>() // A
              .AsQueryable()
              .Select(PortableRecipes.Models.Lunch.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Lunch.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.Lunch : _context.Lunch;
      var editable_targets = ApiTokenValid ? _context.Meal : (_context.Meal);
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.Meal_Recipes.Any(link => link.RecipesId == source.Id && link.MealId == target.Id) &&
              true
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Lunch.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Lunch.WithoutImages, item => item);
    }


    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Recipes_id}/unlinked/Meal_Recipess/Dinner")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Dinner> GetUnlinkedMeal_Recipess_Dinner(int Recipes_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
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
        return Enumerable.Empty<PortableRecipes.Models.Dinner>() // A
              .AsQueryable()
              .Select(PortableRecipes.Models.Dinner.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Dinner.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.Dinner : _context.Dinner;
      var editable_targets = ApiTokenValid ? _context.Meal : (_context.Meal);
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.Meal_Recipes.Any(link => link.RecipesId == source.Id && link.MealId == target.Id) &&
              true
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Dinner.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Dinner.WithoutImages, item => item);
    }


    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Recipes_id}/unlinked/Meal_Recipess/Breakfast")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Breakfast> GetUnlinkedMeal_Recipess_Breakfast(int Recipes_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
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
        return Enumerable.Empty<PortableRecipes.Models.Breakfast>() // A
              .AsQueryable()
              .Select(PortableRecipes.Models.Breakfast.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Breakfast.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.Breakfast : _context.Breakfast;
      var editable_targets = ApiTokenValid ? _context.Meal : (_context.Meal);
      var can_edit_by_token = ApiTokenValid || true;
      return (from target in allowed_targets
              where !_context.Meal_Recipes.Any(link => link.RecipesId == source.Id && link.MealId == target.Id) &&
              true
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Breakfast.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Breakfast.WithoutImages, item => item);
    }


    bool CanAdd_Recipes_Meal_Recipess(Recipes source) {
      return true;
    }

    bool CanAdd_Meal_Meal_Recipess(Meal target) {
      return true;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Recipes_id}/Meal_Recipess_Lunch")]
    public IActionResult /*IEnumerable<Lunch>*/ CreateNewMeal_Recipes_Lunch(int Recipes_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        return Unauthorized();
        // throw new Exception("Cannot create item in relation Meal_Recipess");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Recipes_Meal_Recipess(source) || !can_link_by_token)
        return Unauthorized();
        //throw new Exception("Cannot add item to relation Meal_Recipess");
      var new_target = new Lunch() { CreatedDate = DateTime.Now, Id = _context.Meal.Max(i => i.Id) + 1 };
      _context.Lunch.Add(new_target);
      _context.SaveChanges();
      var link = new Meal_Recipes() { Id = _context.Meal_Recipes.Max(l => l.Id) + 1, RecipesId = source.Id, MealId = new_target.Id };
      _context.Meal_Recipes.Add(link);
      _context.SaveChanges();
      return Ok(new Lunch[] { new_target });
    }
[RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Recipes_id}/Meal_Recipess_Dinner")]
    public IActionResult /*IEnumerable<Dinner>*/ CreateNewMeal_Recipes_Dinner(int Recipes_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        return Unauthorized();
        // throw new Exception("Cannot create item in relation Meal_Recipess");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Recipes_Meal_Recipess(source) || !can_link_by_token)
        return Unauthorized();
        //throw new Exception("Cannot add item to relation Meal_Recipess");
      var new_target = new Dinner() { CreatedDate = DateTime.Now, Id = _context.Meal.Max(i => i.Id) + 1 };
      _context.Dinner.Add(new_target);
      _context.SaveChanges();
      var link = new Meal_Recipes() { Id = _context.Meal_Recipes.Max(l => l.Id) + 1, RecipesId = source.Id, MealId = new_target.Id };
      _context.Meal_Recipes.Add(link);
      _context.SaveChanges();
      return Ok(new Dinner[] { new_target });
    }
[RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Recipes_id}/Meal_Recipess_Breakfast")]
    public IActionResult /*IEnumerable<Breakfast>*/ CreateNewMeal_Recipes_Breakfast(int Recipes_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        return Unauthorized();
        // throw new Exception("Cannot create item in relation Meal_Recipess");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Recipes_Meal_Recipess(source) || !can_link_by_token)
        return Unauthorized();
        //throw new Exception("Cannot add item to relation Meal_Recipess");
      var new_target = new Breakfast() { CreatedDate = DateTime.Now, Id = _context.Meal.Max(i => i.Id) + 1 };
      _context.Breakfast.Add(new_target);
      _context.SaveChanges();
      var link = new Meal_Recipes() { Id = _context.Meal_Recipes.Max(l => l.Id) + 1, RecipesId = source.Id, MealId = new_target.Id };
      _context.Meal_Recipes.Add(link);
      _context.SaveChanges();
      return Ok(new Breakfast[] { new_target });
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Recipes_id}/Meal_Recipess/{Meal_id}")]
    public IActionResult LinkWithMeal_Recipes(int Recipes_id, int Meal_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var allowed_targets = _context.Meal;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Meal_id);
      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Recipes_Meal_Recipess(source) || !can_link_by_token || !can_edit_source_by_token || !can_edit_target_by_token)
        return BadRequest();
        // throw new Exception("Cannot add item to relation Meal_Recipess");
      if (!CanAdd_Meal_Meal_Recipess(target))
        return BadRequest();
        // throw new Exception("Cannot add item to relation Meal_Recipess");
      var link = new Meal_Recipes() { Id = _context.Meal_Recipes.Max(i => i.Id) + 1, RecipesId = source.Id, MealId = target.Id };
      _context.Meal_Recipes.Add(link);
      _context.SaveChanges();
      return Ok();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpDelete("{Recipes_id}/Meal_Recipess/{Meal_id}")]
    public IActionResult UnlinkFromMeal_Recipes(int Recipes_id, int Meal_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var allowed_targets = _context.Meal;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Meal_id);
      var link = _context.Meal_Recipes.FirstOrDefault(l => l.RecipesId == source.Id && l.MealId == target.Id);

      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_unlink_by_token = ApiTokenValid || true;
      if (!can_unlink_by_token || !can_edit_source_by_token || !can_edit_target_by_token) return Unauthorized(); // throw new Exception("Cannot remove item from relation Meal_Recipess");
      _context.Meal_Recipes.Remove(link);
      _context.SaveChanges();
      return Ok();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Recipes_id}/HomePage_Recipess")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<HomePage> GetHomePage_Recipess(int Recipes_id, [FromQuery] int page_index, [FromQuery] int page_size = 25 )
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
        return Enumerable.Empty<PortableRecipes.Models.HomePage>() // B
              .AsQueryable()
              .Select(PortableRecipes.Models.HomePage.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.HomePage.WithoutImages, item => item , null);
      var allowed_targets = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var editable_targets = ApiTokenValid ? _context.HomePage : (_context.HomePage);
      var can_edit_by_token = ApiTokenValid || true;
      var items = (from target in allowed_targets
              select target).OrderBy(i => i.CreatedDate).AsQueryable();
      
      return items
              .Select(PortableRecipes.Models.HomePage.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.HomePage.WithoutImages, item => item , null);
    }

    [HttpGet("{Recipes_id}/HomePage_Recipess/{HomePage_id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*HomePage*/ GetHomePage_RecipesById(int Recipes_id, int HomePage_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Recipes_id);
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return NotFound();
      var allowed_targets = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var item = (from target in allowed_targets
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.HomePage.FilterViewableAttributes(current_User, current_Admin))
              .FirstOrDefault(t => t.Id == HomePage_id);
      if (item == null) return NotFound();
      item = PortableRecipes.Models.HomePage.WithoutImages(item);
      return Ok(item);
    }

    
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*ItemWithEditable<Recipes>*/ GetById(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var editable_items = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var item_full = allowed_items.FirstOrDefault(e => e.Id == id);
      if (item_full == null) return NotFound();
      var item = PortableRecipes.Models.Recipes.FilterViewableAttributesLocal(current_User, current_Admin)(item_full);
      item = PortableRecipes.Models.Recipes.WithoutImages(item);
      return Ok(new ItemWithEditable<Recipes>() {
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
      var allowed_items = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var full_item = allowed_items.FirstOrDefault(e => e.Id == id);
      if (full_item == null) return NotFound();
      var item = PortableRecipes.Models.Recipes.FilterViewableAttributesLocal(current_User, current_Admin)(full_item);
      return Ok(new Container<string> { Content = item.Picture });
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
    public IActionResult /*Recipes*/ Create()
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var can_create_by_token = ApiTokenValid || true;
      if (!can_create_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized create attempt");
      var item = new Recipes() { CreatedDate = DateTime.Now, Id = _context.Recipes.Max(i => i.Id) + 1 };
      _context.Recipes.Add(PortableRecipes.Models.Recipes.FilterViewableAttributesLocal(current_User, current_Admin)(item));
      _context.SaveChanges();
      item = PortableRecipes.Models.Recipes.WithoutImages(item);
      return Ok(item);
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPut]
    [ValidateAntiForgeryToken]
    public IActionResult Update([FromBody] Recipes item)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Recipes : _context.Recipes;
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

    [RestrictToUserType(new string[] {"*"})]
    [HttpDelete("{id}")]
    [ValidateAntiForgeryToken]
    public IActionResult Delete(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var item = _context.Recipes.FirstOrDefault(e => e.Id == id);
      var can_delete_by_token = ApiTokenValid || true;
      if (item == null || !can_delete_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized delete attempt");
      
      if (!allowed_items.Any(a => a.Id == item.Id)) return Unauthorized(); // throw new Exception("Unauthorized delete attempt");
      
      

      _context.Recipes.Remove(item);
      _context.SaveChanges();
      return Ok();
    }


    [RestrictToUserType(new string[] {"*"})]
    [HttpGet]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Recipes> GetAll([FromQuery] int page_index, [FromQuery] int page_size = 25 )
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var editable_items = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var can_edit_by_token = ApiTokenValid || true;
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true;
      var items = allowed_items.OrderBy(i => i.CreatedDate).AsQueryable();
      
      return items
        .Select(PortableRecipes.Models.Recipes.FilterViewableAttributes(current_User, current_Admin))
        .Select(s => Tuple.Create(s, can_edit_by_token && editable_items.Any(es => es.Id == s.Id)))
        .Paginate(can_create_by_token, can_delete_by_token, false, page_index, page_size, PortableRecipes.Models.Recipes.WithoutImages, item => item , null );
    }

    


    
  }

  