import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as Models from '../generated_models'
import * as Api from '../generated_api'
import * as List from '../containers/list'

export let can_view_American = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_create_American = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_American = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_delete_American = (current_User:Models.User, current_Admin:Models.Admin) => true
  
export let can_view_American_Description = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_American_Description = (current_User:Models.User, current_Admin:Models.Admin) => true



export let can_view_Meal = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_create_Meal = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Meal = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_delete_Meal = (current_User:Models.User, current_Admin:Models.Admin) => true
  



export let can_view_Asian = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_create_Asian = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Asian = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_delete_Asian = (current_User:Models.User, current_Admin:Models.Admin) => true
  
export let can_view_Asian_Description = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Asian_Description = (current_User:Models.User, current_Admin:Models.Admin) => true



export let can_view_Recipes = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_create_Recipes = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Recipes = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_delete_Recipes = (current_User:Models.User, current_Admin:Models.Admin) => true
  
export let can_view_Recipes_Picture = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Recipes_Picture = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_view_Recipes_Name = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Recipes_Name = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_view_Recipes_Ingredients = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Recipes_Ingredients = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_view_Recipes_Description = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Recipes_Description = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_view_Recipes_PreparationTime = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Recipes_PreparationTime = (current_User:Models.User, current_Admin:Models.Admin) => true



export let can_view_Lunch = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_create_Lunch = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Lunch = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_delete_Lunch = (current_User:Models.User, current_Admin:Models.Admin) => true
  
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



export let can_view_Dinner = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_create_Dinner = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Dinner = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_delete_Dinner = (current_User:Models.User, current_Admin:Models.Admin) => true
  
export let can_view_Dinner_Description = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Dinner_Description = (current_User:Models.User, current_Admin:Models.Admin) => true



export let can_view_Mediterranean = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_create_Mediterranean = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Mediterranean = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_delete_Mediterranean = (current_User:Models.User, current_Admin:Models.Admin) => true
  
export let can_view_Mediterranean_Description = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Mediterranean_Description = (current_User:Models.User, current_Admin:Models.Admin) => true



export let can_view_Breakfast = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_create_Breakfast = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Breakfast = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_delete_Breakfast = (current_User:Models.User, current_Admin:Models.Admin) => true
  
export let can_view_Breakfast_Description = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Breakfast_Description = (current_User:Models.User, current_Admin:Models.Admin) => true



export let can_view_Categories = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_create_Categories = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Categories = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_delete_Categories = (current_User:Models.User, current_Admin:Models.Admin) => true
  



export let can_view_Rating = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_create_Rating = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Rating = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_delete_Rating = (current_User:Models.User, current_Admin:Models.Admin) => true
  
export let can_view_Rating_rating = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Rating_rating = (current_User:Models.User, current_Admin:Models.Admin) => true




export let can_view_Categories_Meal = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_create_Categories_Meal = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Categories_Meal = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_delete_Categories_Meal = (current_User:Models.User, current_Admin:Models.Admin) => true
  

export let can_view_User_Recipes = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_create_User_Recipes = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_User_Recipes = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_delete_User_Recipes = (current_User:Models.User, current_Admin:Models.Admin) => true
  

export let can_view_Recipes_Rating = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_create_Recipes_Rating = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Recipes_Rating = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_delete_Recipes_Rating = (current_User:Models.User, current_Admin:Models.Admin) => true
  

export let can_view_Meal_Recipes = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_create_Meal_Recipes = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_Meal_Recipes = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_delete_Meal_Recipes = (current_User:Models.User, current_Admin:Models.Admin) => true
  

export let can_view_HomePage_Recipes = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_create_HomePage_Recipes = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_HomePage_Recipes = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_delete_HomePage_Recipes = (current_User:Models.User, current_Admin:Models.Admin) => true
  

export let can_view_HomePage_Categories = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_create_HomePage_Categories = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_edit_HomePage_Categories = (current_User:Models.User, current_Admin:Models.Admin) => true

export let can_delete_HomePage_Categories = (current_User:Models.User, current_Admin:Models.Admin) => true
  


