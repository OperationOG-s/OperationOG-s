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

public class MyTuple <T, U>
{
   public T Item1;
   public U Item2;
  public MyTuple(T Item1, U Item2)
  {
    this.Item1 = Item1;
    this.Item2 = Item2;
  }
}
public static class RNG {
    private static Random rng = new Random();  

    public static void Shuffle<T>(this IList<T> list)  
    {  
      int n = list.Count;  
      while (n > 1) {  
        n--;  
        int k = rng.Next(n + 1);  
        T value = list[k];  
        list[k] = list[n];  
        list[n] = value;  
    }  
    }
   }

// the class structure are all the same except the queries. 
[Route("api/v1/CustomController")]
public class CustomController : Controller
{
  private readonly MailOptions _mailOptions;
  public readonly PortableRecipesContext _context;
//context is the database
 public CustomController(PortableRecipesContext context, IOptions<MailOptions> mailOptionsAccessor)
  {
    _context = context;
    _mailOptions = mailOptionsAccessor.Value;
  }

 [RestrictToUserType(new string[] {"*"})]
  [HttpGet("FindRecipe/{id}")] // this is the link to fetch in the costum_views
  public Recipe FindRecipe(int id) //this is the method name
  {
  // The method contains the query's to select the correct recipes by their ID.
    var recipe = (from _recipe in _context.Recipe
                  where _recipe.Id == id
                  select _recipe).FirstOrDefault();
//if it returns nothing, there is a new exception thrown
   if(recipe == null) throw new Exception("Recipe not found");
   // returns the selected recipe
    return recipe;
  }
  
[RestrictToUserType(new string[] {"*"})]
  [HttpGet("FindMeals/{idCategorie}")]
  public Meal[] FindMeals(int idCategorie)
  {
 
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
        	                 
                              from meal_recipe in _context.Meal_Recipe
                              where (meal_recipe.MealId == idMeal) 
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
 [HttpGet("FindRating/{recipe_id}/{user_id}")]
  public Rating FindRating(int recipe_id, int user_id)
  {
  
    var found_rating = (from recipe_rating in _context.Recipe_Rating
                          where(recipe_rating.RecipeId == recipe_id)
                          from  user_rating in _context.User_Rating
                          where (user_rating.UserId == user_id) && (recipe_rating.RatingId == user_rating.RatingId)
                          from Rating in _context.Rating
                          where (Rating.Id == user_rating.RatingId &&  Rating.Id == recipe_rating.RatingId)
                          select Rating).FirstOrDefault();
    
 
    Console.WriteLine("Rating is found",found_rating);
    return found_rating;
  }
    



    [RestrictToUserType(new string[] {"*"})]
  [HttpGet("GetRecommendedRecipes/{user_id}")]

  public Recipe[] GetRecommendedRecipes(int user_id)
  {

    List<MyTuple<Recipe, int>> recipesrating = new List<MyTuple<Recipe, int>>(); // We instantiate a list with type MyTuple<T, U> and name the types Recipe and int.
                    


    foreach(var recipe in _context.Recipe){ // We create a for-loop that goes through the recipes and looks if the recipe has a rating.
      var maybemaybenotrating = _context.Recipe_Rating.FirstOrDefault(elem => elem.RecipeId == recipe.Id);
      if (maybemaybenotrating == null) { // If it's null, it adds (or instantiates) a rating to the MyTuple (and to the specific recipe IN the for-loop (I THINK... MAYBE... HOPEFULLY)).
        recipesrating.Add(new MyTuple<Recipe, int>(recipe, 0));
      }
      else { // If it's NOT null, it will just assign the the rating it already has to the MyTuple that we are using (and to the specific recipe IN the for-loop (I THINK... MAYBE... HOPEFULLY)).
        var yesrating = _context.Rating.FirstOrDefault(elem => elem.Id == maybemaybenotrating.RatingId);
        recipesrating.Add(new MyTuple<Recipe, int>(recipe, yesrating.rating));
      }
          
      }
    recipesrating.OrderByDescending(elem => elem.Item2); //This orders the recipes that have low ratings to the top of the list.

    
    var topfifteen = recipesrating.Take(Math.Min(recipesrating.Count, 15)).ToList(); //Takes minimum of 2 recipes to showcase
    topfifteen.Shuffle(); // Shuffle method is from a static class that shuffles the elements inside the given list (works like magic).
    return topfifteen.Take(Math.Min(recipesrating.Count, 2)).Select(elem => elem.Item1).ToArray(); // returns the shuffled list.
    }
    
}

