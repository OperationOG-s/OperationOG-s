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

[Route("api/v1/keep_alive")]
public class KeepAliveApiController : Controller
{
  private readonly MailOptions _mailOptions;
  public readonly PortableRecipesContext _context;

  public KeepAliveApiController(PortableRecipesContext context, IOptions<MailOptions> mailOptionsAccessor)
  {
    _context = context;
    _mailOptions = mailOptionsAccessor.Value;
  }

  [HttpGet("ping")]
  [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
  public IActionResult Ping() {
    return Ok();
  }
  [HttpGet("ping_as_User")]
  [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
  public IActionResult PingAsUser() {
    var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
    if (current_User != null)
      return Ok();
    else
      return NotFound();
  }

  [HttpGet("ping_as_Admin")]
  [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
  public IActionResult PingAsAdmin() {
    var session = HttpContext.Get<LoggableEntities>(_context);
      var current_User = session == null ? null : session.User;
      var current_Admin = session == null ? null : session.Admin;
    if (current_Admin != null)
      return Ok();
    else
      return NotFound();
  }

}
