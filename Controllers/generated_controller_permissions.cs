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


namespace PortableRecipes.Models
{
  public static class Permissions {
    static public bool can_view_American(User current_User, Admin current_Admin) { return true; }

    static public bool can_create_American(User current_User, Admin current_Admin) { return true; }

    static public bool can_edit_American(User current_User, Admin current_Admin) { return true; }

    static public bool can_delete_American(User current_User, Admin current_Admin) { return true; }
      
    static public bool can_view_American_Description(User current_User, Admin current_Admin) { return true; }

    static public bool can_edit_American_Description(User current_User, Admin current_Admin) { return true; }
    

    
static public bool can_view_Recommended_Recipes(User current_User, Admin current_Admin) { return true; }

    static public bool can_create_Recommended_Recipes(User current_User, Admin current_Admin) { return true; }

    static public bool can_edit_Recommended_Recipes(User current_User, Admin current_Admin) { return true; }

    static public bool can_delete_Recommended_Recipes(User current_User, Admin current_Admin) { return true; }
      
  

    
static public bool can_view_Meal(User current_User, Admin current_Admin) { return true; }

    static public bool can_create_Meal(User current_User, Admin current_Admin) { return true; }

    static public bool can_edit_Meal(User current_User, Admin current_Admin) { return true; }

    static public bool can_delete_Meal(User current_User, Admin current_Admin) { return true; }
      
  

    
static public bool can_view_Asian(User current_User, Admin current_Admin) { return true; }

    static public bool can_create_Asian(User current_User, Admin current_Admin) { return true; }

    static public bool can_edit_Asian(User current_User, Admin current_Admin) { return true; }

    static public bool can_delete_Asian(User current_User, Admin current_Admin) { return true; }
      
    static public bool can_view_Asian_Description(User current_User, Admin current_Admin) { return true; }

    static public bool can_edit_Asian_Description(User current_User, Admin current_Admin) { return true; }
    

    
static public bool can_view_Recipes(User current_User, Admin current_Admin) { return true; }

    static public bool can_create_Recipes(User current_User, Admin current_Admin) { return true; }

    static public bool can_edit_Recipes(User current_User, Admin current_Admin) { return true; }

    static public bool can_delete_Recipes(User current_User, Admin current_Admin) { return true; }
      
    static public bool can_view_Recipes_Picture(User current_User, Admin current_Admin) { return true; }

    static public bool can_edit_Recipes_Picture(User current_User, Admin current_Admin) { return true; }
    
  static public bool can_view_Recipes_Name(User current_User, Admin current_Admin) { return true; }

    static public bool can_edit_Recipes_Name(User current_User, Admin current_Admin) { return true; }
    
  static public bool can_view_Recipes_Ingredients(User current_User, Admin current_Admin) { return true; }

    static public bool can_edit_Recipes_Ingredients(User current_User, Admin current_Admin) { return true; }
    
  static public bool can_view_Recipes_Description(User current_User, Admin current_Admin) { return true; }

    static public bool can_edit_Recipes_Description(User current_User, Admin current_Admin) { return true; }
    
  static public bool can_view_Recipes_Rating(User current_User, Admin current_Admin) { return true; }

    static public bool can_edit_Recipes_Rating(User current_User, Admin current_Admin) { return true; }
    
  static public bool can_view_Recipes_PreparationTime(User current_User, Admin current_Admin) { return true; }

    static public bool can_edit_Recipes_PreparationTime(User current_User, Admin current_Admin) { return true; }
    

    
static public bool can_view_Lunch(User current_User, Admin current_Admin) { return true; }

    static public bool can_create_Lunch(User current_User, Admin current_Admin) { return true; }

    static public bool can_edit_Lunch(User current_User, Admin current_Admin) { return true; }

    static public bool can_delete_Lunch(User current_User, Admin current_Admin) { return true; }
      
    static public bool can_view_Lunch_Description(User current_User, Admin current_Admin) { return true; }

    static public bool can_edit_Lunch_Description(User current_User, Admin current_Admin) { return true; }
    

    
static public bool can_view_User(User current_User, Admin current_Admin) { return current_Admin != null || current_User != null; }

    static public bool can_create_User(User current_User, Admin current_Admin) { return current_Admin != null; }

    static public bool can_edit_User(User current_User, Admin current_Admin) { return current_Admin != null || current_User != null; }

    static public bool can_delete_User(User current_User, Admin current_Admin) { return current_Admin != null; }
      
    static public bool can_view_User_Username(User current_User, Admin current_Admin) { return true; }

    static public bool can_edit_User_Username(User current_User, Admin current_Admin) { return true; }
    
  static public bool can_view_User_Language(User current_User, Admin current_Admin) { return true; }

    static public bool can_edit_User_Language(User current_User, Admin current_Admin) { return true; }
    
  static public bool can_view_User_Email(User current_User, Admin current_Admin) { return true; }

    static public bool can_edit_User_Email(User current_User, Admin current_Admin) { return true; }
    

    
static public bool can_view_HomePage(User current_User, Admin current_Admin) { return true; }

    static public bool can_create_HomePage(User current_User, Admin current_Admin) { return false; }

    static public bool can_edit_HomePage(User current_User, Admin current_Admin) { return true; }

    static public bool can_delete_HomePage(User current_User, Admin current_Admin) { return false; }
      
  

    
static public bool can_view_Admin(User current_User, Admin current_Admin) { return current_Admin != null; }

    static public bool can_create_Admin(User current_User, Admin current_Admin) { return current_Admin != null; }

    static public bool can_edit_Admin(User current_User, Admin current_Admin) { return current_Admin != null; }

    static public bool can_delete_Admin(User current_User, Admin current_Admin) { return current_Admin != null; }
      
    static public bool can_view_Admin_Username(User current_User, Admin current_Admin) { return true; }

    static public bool can_edit_Admin_Username(User current_User, Admin current_Admin) { return true; }
    
  static public bool can_view_Admin_Language(User current_User, Admin current_Admin) { return true; }

    static public bool can_edit_Admin_Language(User current_User, Admin current_Admin) { return true; }
    
  static public bool can_view_Admin_Email(User current_User, Admin current_Admin) { return true; }

    static public bool can_edit_Admin_Email(User current_User, Admin current_Admin) { return true; }
    

    
static public bool can_view_BookmarkedRecipes(User current_User, Admin current_Admin) { return true; }

    static public bool can_create_BookmarkedRecipes(User current_User, Admin current_Admin) { return true; }

    static public bool can_edit_BookmarkedRecipes(User current_User, Admin current_Admin) { return true; }

    static public bool can_delete_BookmarkedRecipes(User current_User, Admin current_Admin) { return true; }
      
    static public bool can_view_BookmarkedRecipes_Title(User current_User, Admin current_Admin) { return true; }

    static public bool can_edit_BookmarkedRecipes_Title(User current_User, Admin current_Admin) { return true; }
    

    
static public bool can_view_Dinner(User current_User, Admin current_Admin) { return true; }

    static public bool can_create_Dinner(User current_User, Admin current_Admin) { return true; }

    static public bool can_edit_Dinner(User current_User, Admin current_Admin) { return true; }

    static public bool can_delete_Dinner(User current_User, Admin current_Admin) { return true; }
      
    static public bool can_view_Dinner_Description(User current_User, Admin current_Admin) { return true; }

    static public bool can_edit_Dinner_Description(User current_User, Admin current_Admin) { return true; }
    

    
static public bool can_view_Mediterranean(User current_User, Admin current_Admin) { return true; }

    static public bool can_create_Mediterranean(User current_User, Admin current_Admin) { return true; }

    static public bool can_edit_Mediterranean(User current_User, Admin current_Admin) { return true; }

    static public bool can_delete_Mediterranean(User current_User, Admin current_Admin) { return true; }
      
    static public bool can_view_Mediterranean_Description(User current_User, Admin current_Admin) { return true; }

    static public bool can_edit_Mediterranean_Description(User current_User, Admin current_Admin) { return true; }
    

    
static public bool can_view_Breakfast(User current_User, Admin current_Admin) { return true; }

    static public bool can_create_Breakfast(User current_User, Admin current_Admin) { return true; }

    static public bool can_edit_Breakfast(User current_User, Admin current_Admin) { return true; }

    static public bool can_delete_Breakfast(User current_User, Admin current_Admin) { return true; }
      
    static public bool can_view_Breakfast_Description(User current_User, Admin current_Admin) { return true; }

    static public bool can_edit_Breakfast_Description(User current_User, Admin current_Admin) { return true; }
    

    
static public bool can_view_Categories(User current_User, Admin current_Admin) { return true; }

    static public bool can_create_Categories(User current_User, Admin current_Admin) { return true; }

    static public bool can_edit_Categories(User current_User, Admin current_Admin) { return true; }

    static public bool can_delete_Categories(User current_User, Admin current_Admin) { return true; }
      
  

    

    
  }
}
