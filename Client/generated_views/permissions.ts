import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as Models from '../generated_models'
import * as Api from '../generated_api'
import * as List from '../containers/list'

export let can_view_American = (current_User:Models.User, current_Admin:Models.Admin) => current_User != null || current_Admin != null

export let can_create_American = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null

export let can_edit_American = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null

export let can_delete_American = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null
  
export let can_view_American_Description = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_American_Description = (current_User:Models.User, current_Admin:Models.Admin) => true



export let can_view_Meal = (current_User:Models.User, current_Admin:Models.Admin) => current_User != null || current_Admin != null

export let can_create_Meal = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null

export let can_edit_Meal = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null

export let can_delete_Meal = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null
  



export let can_view_Asian = (current_User:Models.User, current_Admin:Models.Admin) => current_User != null || current_Admin != null

export let can_create_Asian = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null

export let can_edit_Asian = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null

export let can_delete_Asian = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null
  
export let can_view_Asian_Description = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Asian_Description = (current_User:Models.User, current_Admin:Models.Admin) => true



export let can_view_Lunch = (current_User:Models.User, current_Admin:Models.Admin) => current_User != null || current_Admin != null

export let can_create_Lunch = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null

export let can_edit_Lunch = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null

export let can_delete_Lunch = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null
  
export let can_view_Lunch_Description = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Lunch_Description = (current_User:Models.User, current_Admin:Models.Admin) => true



export let can_view_User = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null || current_User != null

export let can_create_User = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null

export let can_edit_User = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null || current_User != null

export let can_delete_User = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null
  
export let can_view_User_Username = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_User_Username = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_view_User_Language = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_User_Language = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_view_User_Email = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_User_Email = (current_User:Models.User, current_Admin:Models.Admin) => true



export let can_view_HomePage = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_create_HomePage = (current_User:Models.User, current_Admin:Models.Admin) => false

export let can_edit_HomePage = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_delete_HomePage = (current_User:Models.User, current_Admin:Models.Admin) => false
  
export let can_view_HomePage_AppTest = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_HomePage_AppTest = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_view_HomePage_Test = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_HomePage_Test = (current_User:Models.User, current_Admin:Models.Admin) => true



export let can_view_Recipe = (current_User:Models.User, current_Admin:Models.Admin) => current_User != null || current_Admin != null

export let can_create_Recipe = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null

export let can_edit_Recipe = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null

export let can_delete_Recipe = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null
  
export let can_view_Recipe_Picture = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Recipe_Picture = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_view_Recipe_Name = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Recipe_Name = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_view_Recipe_Ingredients = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Recipe_Ingredients = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_view_Recipe_Description = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Recipe_Description = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_view_Recipe_PreparationTime = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Recipe_PreparationTime = (current_User:Models.User, current_Admin:Models.Admin) => true



export let can_view_Admin = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null

export let can_create_Admin = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null

export let can_edit_Admin = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null

export let can_delete_Admin = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null
  
export let can_view_Admin_Username = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Admin_Username = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_view_Admin_Language = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Admin_Language = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_view_Admin_Email = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Admin_Email = (current_User:Models.User, current_Admin:Models.Admin) => true



export let can_view_Dinner = (current_User:Models.User, current_Admin:Models.Admin) => current_User != null || current_Admin != null

export let can_create_Dinner = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null

export let can_edit_Dinner = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null

export let can_delete_Dinner = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null
  
export let can_view_Dinner_Description = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Dinner_Description = (current_User:Models.User, current_Admin:Models.Admin) => true



export let can_view_Categorie = (current_User:Models.User, current_Admin:Models.Admin) => current_User != null || current_Admin != null

export let can_create_Categorie = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null

export let can_edit_Categorie = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null

export let can_delete_Categorie = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null
  



export let can_view_Mediterranean = (current_User:Models.User, current_Admin:Models.Admin) => current_User != null || current_Admin != null

export let can_create_Mediterranean = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null

export let can_edit_Mediterranean = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null

export let can_delete_Mediterranean = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null
  
export let can_view_Mediterranean_Description = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Mediterranean_Description = (current_User:Models.User, current_Admin:Models.Admin) => true



export let can_view_Breakfast = (current_User:Models.User, current_Admin:Models.Admin) => current_User != null || current_Admin != null

export let can_create_Breakfast = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null

export let can_edit_Breakfast = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null

export let can_delete_Breakfast = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null
  
export let can_view_Breakfast_Description = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Breakfast_Description = (current_User:Models.User, current_Admin:Models.Admin) => true



export let can_view_CategoryList = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_create_CategoryList = (current_User:Models.User, current_Admin:Models.Admin) => false

export let can_edit_CategoryList = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_delete_CategoryList = (current_User:Models.User, current_Admin:Models.Admin) => false
  
export let can_view_CategoryList_CategoriesViewAtt = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_CategoryList_CategoriesViewAtt = (current_User:Models.User, current_Admin:Models.Admin) => true



export let can_view_Rating = (current_User:Models.User, current_Admin:Models.Admin) => current_User != null || current_Admin != null

export let can_create_Rating = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null

export let can_edit_Rating = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null

export let can_delete_Rating = (current_User:Models.User, current_Admin:Models.Admin) => current_Admin != null
  
export let can_view_Rating_rating = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Rating_rating = (current_User:Models.User, current_Admin:Models.Admin) => true



export let can_view_Bookmarks = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_create_Bookmarks = (current_User:Models.User, current_Admin:Models.Admin) => false

export let can_edit_Bookmarks = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_delete_Bookmarks = (current_User:Models.User, current_Admin:Models.Admin) => false
  
export let can_view_Bookmarks_BookmarkViewAtt = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Bookmarks_BookmarkViewAtt = (current_User:Models.User, current_Admin:Models.Admin) => true




export let can_view_Categorie_Meal = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_create_Categorie_Meal = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Categorie_Meal = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_delete_Categorie_Meal = (current_User:Models.User, current_Admin:Models.Admin) => true
  

export let can_view_User_Recipe = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_create_User_Recipe = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_User_Recipe = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_delete_User_Recipe = (current_User:Models.User, current_Admin:Models.Admin) => true
  

export let can_view_Recipe_Rating = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_create_Recipe_Rating = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Recipe_Rating = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_delete_Recipe_Rating = (current_User:Models.User, current_Admin:Models.Admin) => true
  

export let can_view_Meal_Recipe = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_create_Meal_Recipe = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Meal_Recipe = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_delete_Meal_Recipe = (current_User:Models.User, current_Admin:Models.Admin) => true
  

export let can_view_Categorie_Recipe = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_create_Categorie_Recipe = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Categorie_Recipe = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_delete_Categorie_Recipe = (current_User:Models.User, current_Admin:Models.Admin) => true
  


