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
  
export type Recipes = {
    Id : number
    CreatedDate:Moment.Moment
    Picture : string
  Name : string
  Ingredients : string
  Description : string
  PreparationTime : number
    
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
  
export type Categories = {
    Id : number
    CreatedDate:Moment.Moment
    
    
  } & (American | Asian | Mediterranean)
  
export type Rating = {
    Id : number
    CreatedDate:Moment.Moment
    rating : number
    
  }
  
export type Categories_Meal = {
    Id : number
    CreatedDate:Moment.Moment
    CategoriesId : number
  MealId : number
    
  }
  

export type User_Recipes = {
    Id : number
    CreatedDate:Moment.Moment
    UserId : number
  RecipesId : number
    
  }
  

export type Recipes_Rating = {
    Id : number
    CreatedDate:Moment.Moment
    RecipesId : number
  RatingId : number
    
  }
  

export type Meal_Recipes = {
    Id : number
    CreatedDate:Moment.Moment
    MealId : number
  RecipesId : number
    
  }
  

export type HomePage_Recipes = {
    Id : number
    CreatedDate:Moment.Moment
    HomePageId : number
  RecipesId : number
    
  }
  

export type HomePage_Categories = {
    Id : number
    CreatedDate:Moment.Moment
    HomePageId : number
  CategoriesId : number
    
  }
  

