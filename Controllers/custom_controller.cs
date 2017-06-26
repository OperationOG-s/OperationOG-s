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




[Route("api/v1/CustomController")]
public class CustomController : Controller
{
  private readonly MailOptions _mailOptions;
  public readonly PortableRecipesContext _context;

  public CustomController(PortableRecipesContext context, IOptions<MailOptions> mailOptionsAccessor)
  {
    _context = context;
    _mailOptions = mailOptionsAccessor.Value;
  }

  [RestrictToUserType(new string[] {"*"})]
  [HttpPut("FindRecipe/{id}")]
  public Recipe FindRecipe(int id)
  {
    //var recipe = _context.Recipe.FirstOrDefault(elem => elem.Id == id);
    var recipe = (from _recipe in _context.Recipe
                  where _recipe.Id == id
                  select _recipe).FirstOrDefault();

    if(recipe == null) throw new Exception("Recipe not found");
    return recipe;
  }

  



}