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
  [HttpGet("FindRecipe/{id}")]
  public Recipe FindRecipe(int id)
  {
    //var recipe = _context.Recipe.FirstOrDefault(elem => elem.Id == id);
    var recipe = (from _recipe in _context.Recipe
                  where _recipe.Id == id
                  select _recipe).FirstOrDefault();

    if(recipe == null) throw new Exception("Recipe not found");
    return recipe;
  }
  
 [RestrictToUserType(new string[] {"*"})]
  [HttpGet("FindMeals/{idCategorie}/{idMeals}")]
  public Categorie_Meal FindMeals(int idCategorie, int idMeals)
  {
    //var recipe = _context.Recipe.FirstOrDefault(elem => elem.Id == id);
    var findmeals = (from _findmeals in _context.Categorie_Meal
                  where (_findmeals.CategorieId == idCategorie) //&& GGGG(_findmeals.MealId== idMeals) //(idMeals == 1)  && (idMeals == 2) && (idMeals == 3)
                  select _findmeals).FirstOrDefault();

   if(findmeals  == null) throw new Exception("category not found");
    return findmeals ;
  }



}