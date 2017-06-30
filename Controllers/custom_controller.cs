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
// olaa 
public class Tuple <T,U>
{
   public T Item1;
   public U Item2;
  public Tuple(T Item1, U Item2)
  {
    this.Item1 = Item1;
    this.Item2 = Item2;
  }
}

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
  [HttpGet("FindMeals/{idCategorie}")]
  public Meal[] FindMeals(int idCategorie)
  {
    //var recipe = _context.Recipe.FirstOrDefault(elem => elem.Id == id);
    var findmeals = (from _findmeals in _context.Categorie_Meal
                     where (_findmeals.CategorieId == idCategorie) //&& GGGG(_findmeals.MealId== idMeals) //(idMeals == 1)  && (idMeals == 2) && (idMeals == 3)
                     from meal in _context.Meal
                     where meal.Id == _findmeals.MealId
                     select meal);

  if(findmeals  == null) throw new Exception("Meal not found");
    return findmeals.ToArray();
  }

// [RestrictToUserType(new string[] {"*"})]
//   [HttpGet("FindCorrectRecipe/{id}")]
//   public Meal_Recipe[] FindCorrectRecipe(int id)
//   {
//     var findcorrectrecipe = (from _findcorrectrecipe in _context.Meal_Recipe
//                      where (_findcorrectrecipe.Id == id)
//                      from meal in _context.Meal
//                      where meal.Id == _findcorrectrecipe.MealId
//                      select _findcorrectrecipe);

//   if(findcorrectrecipe  == null) throw new Exception("Correct Recipe not found");
//     return findcorrectrecipe.ToArray();
//   }
  
  
[RestrictToUserType(new string[] {"*"})]
  [HttpGet("FindCorrectRecipe/{id}/{idCategorie}/{idRecipe}")]
  public Recipe[] FindCorrectRecipe(int id, int idCategorie, int idRecipe)
  {
    var findcorrectrecipe = (from _findcorrectrecipe in _context.Meal_Recipe
                     where (_findcorrectrecipe.Id == id)
                     from category in _context.Categorie
                     where category.Id == idCategorie
                     from recipes in _context.Recipe
                     where recipes.Id == idRecipe
                     select recipes);

  if(findcorrectrecipe  == null) throw new Exception("Correct Recipe not found");
    return findcorrectrecipe.ToArray();
  }

  [RestrictToUserType(new string[] {"*"})]
  [HttpGet("GetRecommendedRecipes/{Userid}")]

  public Recipe[] GetRecommendedRecipes(int Userid)
  {
    var user = _context.User.FirstOrDefault(_user => _user.Id == Userid);
    if (user == null)
      throw new Exception ("Cannot find User");
    var recommendedrecipes = (from recipe_user in _context.User_Recipe
                              where recipe_user.UserId == Userid 
                              from recipe in _context.Recipe
                              where recipe.Id == recipe_user.RecipeId
                              from Recipe_Rating in _context.Recipe_Rating
                              where Recipe_Rating.RecipeId == recipe.Id
                              from Rating in _context.Rating 
                              where Rating.Id == Recipe_Rating.Rating.Id
                              select new Tuple <Rating, Recipe>(Rating,recipe)
                              ).OrderByDescending(Item => Item.Item1.rating);

    var itemstoreturn = new List<Recipe> ();
      int count = 0;
      foreach (var recipe in recommendedrecipes ){
        count = count + 1;
        if(count > 3){
          break;
        }
        itemstoreturn.Add(recipe.Item2);
      }

    return itemstoreturn.ToArray();
  _context.SaveChanges


  }





}