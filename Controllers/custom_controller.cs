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
public class MyTuple <T,U>
{
   public T Item1;
   public U Item2;
  public MyTuple(T Item1, U Item2)
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
                     where (_findmeals.CategorieId == idCategorie) 
                     from meal in _context.Meal
                     where meal.Id == _findmeals.MealId
                     select meal);

  if(findmeals  == null) throw new Exception("Meal not found");
    return findmeals.ToArray();
  }

[RestrictToUserType(new string[] {"*"})]
  [HttpGet("FindCorrectRecipe/{idMeal}/{idCategorie}")]
  public Recipe[] FindCorrectRecipe(int idMeal, int idCategorie)
  {
    var findcorrectrecipe = (
        	                    // Meal Recipe
                              // Categorie Recipe
                              // Categorie Meal
                              from meal_recipe in _context.Meal_Recipe
                              where (meal_recipe.MealId == idMeal) //&& (meal_recipe.RecipeId == idRecipe) 
                              from categorie_meal in _context.Categorie_Meal
                              where (categorie_meal.CategorieId == idCategorie) && (categorie_meal.MealId == idMeal) && (meal_recipe.MealId == categorie_meal.MealId)
                              from categorie_recipe in _context.Categorie_Recipe
                              where (categorie_recipe.CategorieId == categorie_meal.CategorieId) && (categorie_recipe.RecipeId == meal_recipe.RecipeId) 
                              from recipe in _context.Recipe
                              where categorie_recipe.RecipeId == recipe.Id
                              select recipe);
                            

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
                              select new MyTuple <Rating, Recipe>(Rating,recipe)
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


  }
[RestrictToUserType(new string[] {"*"})]
  [HttpPost("UserRating/{rating}/{recipe_id}/{user_id}")]
  public void UserRating(int rating,int recipe_id, int user_id)
  {
    var stored_rating = (from recipe_rating in _context.Recipe_Rating
                          where(recipe_rating.RecipeId == recipe_id)
                          from  user_rating in _context.User_Rating
                          where (user_rating.UserId == user_id) && (recipe_rating.RatingId == user_rating.RatingId)
                          from Rating in _context.Rating
                          where (Rating.Id == user_rating.RatingId &&  Rating.Id == recipe_rating.RatingId)
                          select Rating).FirstOrDefault();
    if(stored_rating == null){
      System.Console.WriteLine("did not found one!");
      Rating newRating = new Rating(){ rating = rating, Id = _context.Rating.Max(elem => elem.Id) + 1 };
      _context.Rating.Add(newRating);

      User_Rating newUser_Rating = new User_Rating(){ UserId = user_id, RatingId = newRating.Id };
      _context.User_Rating.Add(newUser_Rating);

      Recipe_Rating newRecipe_Rating = new Recipe_Rating(){ RecipeId = recipe_id, RatingId = newRating.Id };
      _context.Recipe_Rating.Add(newRecipe_Rating);
    }
    else{
      System.Console.WriteLine("found one!");
      stored_rating.rating = rating;
    }


    _context.SaveChanges();   
     
}

  [RestrictToUserType(new string[] {"*"})]
  [HttpGet("FindRating/{id}/{idRating}/{idRecipe}")]
  public Rating[] FindRating(int id,int idRating, int idRecipe)
  {
    var  find_rating = (from _findrating in _context.Recipe_Rating
                     where(_findrating.Id == id) && (_findrating.RatingId == idRating) && (_findrating.RecipeId == idRecipe)
                     from ratings in _context.Rating
                     where (ratings.Id == idRating)
                     select ratings
                       );
    if(find_rating == null) throw new Exception("Rating not found");
    return find_rating.ToArray();
    
 }


   [RestrictToUserType(new string[] {"*"})]
  [HttpGet("Bookmarked/{idUser}")]
  public Recipe[] Bookmarked(int idUser)
  {
    var bookmarked = (from User_Recipe in _context.User_Recipe
                  where User_Recipe.UserId == idUser 
                  from _recipe in _context.Recipe
                  where  (User_Recipe.RecipeId == _recipe.Id )   
                  select _recipe);

 
    return bookmarked.ToArray();
  }
  



}