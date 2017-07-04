import * as Immutable from 'immutable'
import * as Moment from 'moment'

export type American = {
    Id : number
    CreatedDate:Moment.Moment
    Description : string
    Kind:"American"
  }
  
export type Meal = {
    Id : number
    CreatedDate:Moment.Moment
    
    
  } & (Lunch | Dinner | Breakfast)
  
export type Asian = {
    Id : number
    CreatedDate:Moment.Moment
    Description : string
    Kind:"Asian"
  }
  
export type Lunch = {
    Id : number
    CreatedDate:Moment.Moment
    Description : string
    Kind:"Lunch"
  }
  
export type User = {
    Id : number
    CreatedDate:Moment.Moment
    Username : string
  Language : string
  Email : string
HasPassword:boolean
    
  }
  
export type HomePage = {
    Id : number
    CreatedDate:Moment.Moment
    
  Test : string
    
  }
  
export type Recipe = {
    Id : number
    CreatedDate:Moment.Moment
    Picture : string
  Name : string
  Ingredients : string
  Description : string
  PreparationTime : number
    
  }
  
export type Admin = {
    Id : number
    CreatedDate:Moment.Moment
    Username : string
  Language : string
  Email : string
HasPassword:boolean
    
  }
  
export type Dinner = {
    Id : number
    CreatedDate:Moment.Moment
    Description : string
    Kind:"Dinner"
  }
  
export type Categorie = {
    Id : number
    CreatedDate:Moment.Moment
    
    
  } & (American | Asian | Mediterranean)
  
export type Mediterranean = {
    Id : number
    CreatedDate:Moment.Moment
    Description : string
    Kind:"Mediterranean"
  }
  
export type Breakfast = {
    Id : number
    CreatedDate:Moment.Moment
    Description : string
    Kind:"Breakfast"
  }
  
export type CategoryList = {
    Id : number
    CreatedDate:Moment.Moment
    
    
  }
  
export type Rating = {
    Id : number
    CreatedDate:Moment.Moment
    rating : number
    
  }
  
export type Bookmarks = {
    Id : number
    CreatedDate:Moment.Moment
    
    
  }
  
export type Categorie_Meal = {
    Id : number
    CreatedDate:Moment.Moment
    CategorieId : number
  MealId : number
    
  }
  

export type User_Recipe = {
    Id : number
    CreatedDate:Moment.Moment
    UserId : number
  RecipeId : number
    
  }
  

export type User_Rating = {
    Id : number
    CreatedDate:Moment.Moment
    UserId : number
  RatingId : number
    
  }
  

export type Recipe_Rating = {
    Id : number
    CreatedDate:Moment.Moment
    RecipeId : number
  RatingId : number
    
  }
  

export type Meal_Recipe = {
    Id : number
    CreatedDate:Moment.Moment
    MealId : number
  RecipeId : number
    
  }
  

export type Categorie_Recipe = {
    Id : number
    CreatedDate:Moment.Moment
    CategorieId : number
  RecipeId : number
    
  }
  

