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


  [Route("api/v1/Rating")]
  public class RatingApiController : Controller
  {
    private readonly MailOptions _mailOptions;
    public readonly PortableRecipesContext _context;
    private IHostingEnvironment env;

    public RatingApiController(PortableRecipesContext context, IHostingEnvironment env, IOptions<MailOptions> mailOptionsAccessor)
    {
      _context = context;
      _mailOptions = mailOptionsAccessor.Value;
      this.env = env;
    }

    public bool ApiTokenValid => RestrictToUserTypeAttribute.ApiToken != null &&
        HttpContext.Request.Headers["ApiToken"] == RestrictToUserTypeAttribute.ApiToken;

    
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Rating_id}/Recipes_Ratings")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Recipes> GetRecipes_Ratings(int Rating_id, [FromQuery] int page_index, [FromQuery] int page_size = 25 )
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Rating : _context.Rating;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Rating_id);
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
      var items = (from link in _context.Recipes_Rating
              where link.RatingId == source.Id
              from target in allowed_targets
              where link.RecipesId == target.Id
              select target).OrderBy(i => i.CreatedDate).AsQueryable();
      
      return items
              .Select(PortableRecipes.Models.Recipes.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Recipes.WithoutImages, item => item , null);
    }

    [HttpGet("{Rating_id}/Recipes_Ratings/{Recipes_id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*Recipes*/ GetRecipes_RatingById(int Rating_id, int Recipes_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Rating : _context.Rating;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Rating_id);
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return NotFound();
      var allowed_targets = ApiTokenValid ? _context.Recipes : _context.Recipes;
      var item = (from link in _context.Recipes_Rating
              where link.RatingId == source.Id
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
    [HttpGet("{Rating_id}/unlinked/Recipes_Ratings")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Recipes> GetUnlinkedRecipes_Ratings(int Rating_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Rating : _context.Rating;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Rating_id);
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
              where !_context.Recipes_Rating.Any(link => link.RatingId == source.Id && link.RecipesId == target.Id) &&
              true
              select target).OrderBy(i => i.CreatedDate)
              .Select(PortableRecipes.Models.Recipes.FilterViewableAttributes(current_User, current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PortableRecipes.Models.Recipes.WithoutImages, item => item);
    }

    bool CanAdd_Rating_Recipes_Ratings(Rating source) {
      return (from link in _context.Recipes_Rating
           where link.RatingId == source.Id
           from target in _context.Recipes
           where link.RecipesId == target.Id
           select target).Count() < 1;
    }

    bool CanAdd_Recipes_Recipes_Ratings(Recipes target) {
      return true;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Rating_id}/Recipes_Ratings_Recipes")]
    public IActionResult /*IEnumerable<Recipes>*/ CreateNewRecipes_Rating_Recipes(int Rating_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = ApiTokenValid ? _context.Rating : _context.Rating;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Rating_id);
      var can_create_by_token = ApiTokenValid || true;
      if (source == null || !can_create_by_token)
        return Unauthorized();
        // throw new Exception("Cannot create item in relation Recipes_Ratings");
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Rating_Recipes_Ratings(source) || !can_link_by_token)
        return Unauthorized();
        //throw new Exception("Cannot add item to relation Recipes_Ratings");
      var new_target = new Recipes() { CreatedDate = DateTime.Now, Id = _context.Recipes.Max(i => i.Id) + 1 };
      _context.Recipes.Add(new_target);
      _context.SaveChanges();
      var link = new Recipes_Rating() { Id = _context.Recipes_Rating.Max(l => l.Id) + 1, RatingId = source.Id, RecipesId = new_target.Id };
      _context.Recipes_Rating.Add(link);
      _context.SaveChanges();
      return Ok(new Recipes[] { new_target });
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Rating_id}/Recipes_Ratings/{Recipes_id}")]
    public IActionResult LinkWithRecipes_Rating(int Rating_id, int Recipes_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Rating;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Rating_id);
      var allowed_targets = _context.Recipes;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Recipes_id);
      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_link_by_token = ApiTokenValid || true;
      if (!CanAdd_Rating_Recipes_Ratings(source) || !can_link_by_token || !can_edit_source_by_token || !can_edit_target_by_token)
        return BadRequest();
        // throw new Exception("Cannot add item to relation Recipes_Ratings");
      if (!CanAdd_Recipes_Recipes_Ratings(target))
        return BadRequest();
        // throw new Exception("Cannot add item to relation Recipes_Ratings");
      var link = new Recipes_Rating() { Id = _context.Recipes_Rating.Max(i => i.Id) + 1, RatingId = source.Id, RecipesId = target.Id };
      _context.Recipes_Rating.Add(link);
      _context.SaveChanges();
      return Ok();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpDelete("{Rating_id}/Recipes_Ratings/{Recipes_id}")]
    public IActionResult UnlinkFromRecipes_Rating(int Rating_id, int Recipes_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_sources = _context.Rating;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Rating_id);
      var allowed_targets = _context.Recipes;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Recipes_id);
      var link = _context.Recipes_Rating.FirstOrDefault(l => l.RatingId == source.Id && l.RecipesId == target.Id);

      var can_edit_source_by_token = ApiTokenValid || true;
      var can_edit_target_by_token = ApiTokenValid || true;
      var can_unlink_by_token = ApiTokenValid || true;
      if (!can_unlink_by_token || !can_edit_source_by_token || !can_edit_target_by_token) return Unauthorized(); // throw new Exception("Cannot remove item from relation Recipes_Ratings");
      _context.Recipes_Rating.Remove(link);
      _context.SaveChanges();
      return Ok();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*ItemWithEditable<Rating>*/ GetById(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Rating : _context.Rating;
      var editable_items = ApiTokenValid ? _context.Rating : _context.Rating;
      var item_full = allowed_items.FirstOrDefault(e => e.Id == id);
      if (item_full == null) return NotFound();
      var item = PortableRecipes.Models.Rating.FilterViewableAttributesLocal(current_User, current_Admin)(item_full);
      item = PortableRecipes.Models.Rating.WithoutImages(item);
      return Ok(new ItemWithEditable<Rating>() {
        Item = item,
        Editable = editable_items.Any(e => e.Id == item.Id) });
    }
    

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult /*Rating*/ Create()
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var can_create_by_token = ApiTokenValid || true;
      if (!can_create_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized create attempt");
      var item = new Rating() { CreatedDate = DateTime.Now, Id = _context.Rating.Max(i => i.Id) + 1 };
      _context.Rating.Add(PortableRecipes.Models.Rating.FilterViewableAttributesLocal(current_User, current_Admin)(item));
      _context.SaveChanges();
      item = PortableRecipes.Models.Rating.WithoutImages(item);
      return Ok(item);
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPut]
    [ValidateAntiForgeryToken]
    public IActionResult Update([FromBody] Rating item)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Rating : _context.Rating;
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
      var allowed_items = ApiTokenValid ? _context.Rating : _context.Rating;
      var item = _context.Rating.FirstOrDefault(e => e.Id == id);
      var can_delete_by_token = ApiTokenValid || true;
      if (item == null || !can_delete_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized delete attempt");
      
      if (!allowed_items.Any(a => a.Id == item.Id)) return Unauthorized(); // throw new Exception("Unauthorized delete attempt");
      
      

      _context.Rating.Remove(item);
      _context.SaveChanges();
      return Ok();
    }


    [RestrictToUserType(new string[] {"*"})]
    [HttpGet]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Rating> GetAll([FromQuery] int page_index, [FromQuery] int page_size = 25 )
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
      var allowed_items = ApiTokenValid ? _context.Rating : _context.Rating;
      var editable_items = ApiTokenValid ? _context.Rating : _context.Rating;
      var can_edit_by_token = ApiTokenValid || true;
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true;
      var items = allowed_items.OrderBy(i => i.CreatedDate).AsQueryable();
      
      return items
        .Select(PortableRecipes.Models.Rating.FilterViewableAttributes(current_User, current_Admin))
        .Select(s => Tuple.Create(s, can_edit_by_token && editable_items.Any(es => es.Id == s.Id)))
        .Paginate(can_create_by_token, can_delete_by_token, false, page_index, page_size, PortableRecipes.Models.Rating.WithoutImages, item => item , null );
    }

    


    
  }

  