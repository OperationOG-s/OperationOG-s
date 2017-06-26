using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace PortableRecipes.Models
{
    public partial class American: Categorie {
    public American() {
      
    }
    
    
        public string Description {get;set;}
    
    static new public Expression<Func<American,American>> FilterViewableAttributes(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public new Func<American,American> FilterViewableAttributesLocal(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public American WithoutImages(American self) {
      
      return self;
    }
  }

  
  
  public partial class Meal: IEntity {
    public Meal() {
      Categorie_Meals = new HashSet<Categorie_Meal>();
      Meal_Recipes = new HashSet<Meal_Recipe>();
    }
    public int Id {get;set;}
    [Newtonsoft.Json.JsonIgnore] public virtual ICollection<Categorie_Meal> Categorie_Meals {get;set;}
    [Newtonsoft.Json.JsonIgnore] public virtual ICollection<Meal_Recipe> Meal_Recipes {get;set;}
    [Newtonsoft.Json.JsonProperty(ItemConverterType = typeof(Newtonsoft.Json.Converters.JavaScriptDateTimeConverter))] public DateTime CreatedDate{ get; set; }
    public string Kind {get { return this is Lunch ? "Lunch": this is Dinner ? "Dinner": this is Breakfast ? "Breakfast" : null; } }
    
    
    static public Expression<Func<Meal,Meal>> FilterViewableAttributes(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Func<Meal,Meal> FilterViewableAttributesLocal(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Meal WithoutImages(Meal self) {
      
      return self;
    }
  }

  
  
  public partial class Asian: Categorie {
    public Asian() {
      
    }
    
    
        public string Description {get;set;}
    
    static new public Expression<Func<Asian,Asian>> FilterViewableAttributes(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public new Func<Asian,Asian> FilterViewableAttributesLocal(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Asian WithoutImages(Asian self) {
      
      return self;
    }
  }

  
  
  public partial class Lunch: Meal {
    public Lunch() {
      
    }
    
    
        public string Description {get;set;}
    
    static new public Expression<Func<Lunch,Lunch>> FilterViewableAttributes(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public new Func<Lunch,Lunch> FilterViewableAttributesLocal(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Lunch WithoutImages(Lunch self) {
      
      return self;
    }
  }

  
  
  public partial class User: IEntity {
    public User() {
      User_Recipes = new HashSet<User_Recipe>();
    }
    public int Id {get;set;}
    [Newtonsoft.Json.JsonIgnore] public virtual ICollection<User_Recipe> User_Recipes {get;set;}
    [Newtonsoft.Json.JsonProperty(ItemConverterType = typeof(Newtonsoft.Json.Converters.JavaScriptDateTimeConverter))] public DateTime CreatedDate{ get; set; }
        public string Username {get;set;}
    public string Language {get;set;}
    public string Email {get;set;}
    [Newtonsoft.Json.JsonIgnore] public string PasswordHash {get;set;}
    [Newtonsoft.Json.JsonIgnore] public string PasswordSalt {get;set;}
    [Newtonsoft.Json.JsonIgnore] public DateTime LastLoginAttempt {get;set;}
    static public Expression<Func<User,User>> FilterViewableAttributes(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Func<User,User> FilterViewableAttributesLocal(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public User WithoutImages(User self) {
      
      return self;
    }
  }

  public partial class UserViewData {
    public int Id {get;set;}
    public string Username {get;set;}
    public string Language {get;set;}
    public string Email {get;set;}
    [Newtonsoft.Json.JsonProperty(ItemConverterType = typeof(Newtonsoft.Json.Converters.JavaScriptDateTimeConverter))]
    public DateTime CreatedDate {get;set;}
    public bool HasPassword {get;set;}
    static public UserViewData FromUser(User item) {
      return new UserViewData() { Id = item.Id, CreatedDate = item.CreatedDate, HasPassword = item.PasswordHash != null, Username = item.Username, Language = item.Language, Email = item.Email };
    }
    static public User FromUserViewData(UserViewData item, PortableRecipesContext context) {
      var original = context.User.FirstOrDefault(i => i.Id == item.Id);
      original.Username = item.Username;
      original.Language = item.Language;
      original.Email = item.Email;
      original.CreatedDate = item.CreatedDate;
      return original;
    }
  }

  
  
  public partial class HomePage: IEntity {
    public HomePage() {
      
    }
    public int Id {get;set;}
    
    [Newtonsoft.Json.JsonProperty(ItemConverterType = typeof(Newtonsoft.Json.Converters.JavaScriptDateTimeConverter))] public DateTime CreatedDate{ get; set; }
        public string Test {get;set;}
    
    static public Expression<Func<HomePage,HomePage>> FilterViewableAttributes(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Func<HomePage,HomePage> FilterViewableAttributesLocal(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public HomePage WithoutImages(HomePage self) {
      
      return self;
    }
  }

  
  
  public partial class Recipe: IEntity {
    public Recipe() {
      User_Recipes = new HashSet<User_Recipe>();
      Recipe_Ratings = new HashSet<Recipe_Rating>();
      Meal_Recipes = new HashSet<Meal_Recipe>();
    }
    public int Id {get;set;}
    [Newtonsoft.Json.JsonIgnore] public virtual ICollection<User_Recipe> User_Recipes {get;set;}
    [Newtonsoft.Json.JsonIgnore] public virtual ICollection<Recipe_Rating> Recipe_Ratings {get;set;}
    [Newtonsoft.Json.JsonIgnore] public virtual ICollection<Meal_Recipe> Meal_Recipes {get;set;}
    [Newtonsoft.Json.JsonProperty(ItemConverterType = typeof(Newtonsoft.Json.Converters.JavaScriptDateTimeConverter))] public DateTime CreatedDate{ get; set; }
        public string Picture {get;set;}
    public string Name {get;set;}
    public string Ingredients {get;set;}
    public string Description {get;set;}
    public int PreparationTime {get;set;}
    
    static public Expression<Func<Recipe,Recipe>> FilterViewableAttributes(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Func<Recipe,Recipe> FilterViewableAttributesLocal(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Recipe WithoutImages(Recipe self) {
      self.Picture = null;
      return self;
    }
  }

  
  
  public partial class Admin: IEntity {
    public Admin() {
      
    }
    public int Id {get;set;}
    
    [Newtonsoft.Json.JsonProperty(ItemConverterType = typeof(Newtonsoft.Json.Converters.JavaScriptDateTimeConverter))] public DateTime CreatedDate{ get; set; }
        public string Username {get;set;}
    public string Language {get;set;}
    public string Email {get;set;}
    [Newtonsoft.Json.JsonIgnore] public string PasswordHash {get;set;}
    [Newtonsoft.Json.JsonIgnore] public string PasswordSalt {get;set;}
    [Newtonsoft.Json.JsonIgnore] public DateTime LastLoginAttempt {get;set;}
    static public Expression<Func<Admin,Admin>> FilterViewableAttributes(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Func<Admin,Admin> FilterViewableAttributesLocal(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Admin WithoutImages(Admin self) {
      
      return self;
    }
  }

  public partial class AdminViewData {
    public int Id {get;set;}
    public string Username {get;set;}
    public string Language {get;set;}
    public string Email {get;set;}
    [Newtonsoft.Json.JsonProperty(ItemConverterType = typeof(Newtonsoft.Json.Converters.JavaScriptDateTimeConverter))]
    public DateTime CreatedDate {get;set;}
    public bool HasPassword {get;set;}
    static public AdminViewData FromAdmin(Admin item) {
      return new AdminViewData() { Id = item.Id, CreatedDate = item.CreatedDate, HasPassword = item.PasswordHash != null, Username = item.Username, Language = item.Language, Email = item.Email };
    }
    static public Admin FromAdminViewData(AdminViewData item, PortableRecipesContext context) {
      var original = context.Admin.FirstOrDefault(i => i.Id == item.Id);
      original.Username = item.Username;
      original.Language = item.Language;
      original.Email = item.Email;
      original.CreatedDate = item.CreatedDate;
      return original;
    }
  }

  
  
  public partial class Dinner: Meal {
    public Dinner() {
      
    }
    
    
        public string Description {get;set;}
    
    static new public Expression<Func<Dinner,Dinner>> FilterViewableAttributes(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public new Func<Dinner,Dinner> FilterViewableAttributesLocal(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Dinner WithoutImages(Dinner self) {
      
      return self;
    }
  }

  
  
  public partial class Categorie: IEntity {
    public Categorie() {
      Categorie_Meals = new HashSet<Categorie_Meal>();
    }
    public int Id {get;set;}
    [Newtonsoft.Json.JsonIgnore] public virtual ICollection<Categorie_Meal> Categorie_Meals {get;set;}
    [Newtonsoft.Json.JsonProperty(ItemConverterType = typeof(Newtonsoft.Json.Converters.JavaScriptDateTimeConverter))] public DateTime CreatedDate{ get; set; }
    public string Kind {get { return this is American ? "American": this is Asian ? "Asian": this is Mediterranean ? "Mediterranean" : null; } }
    
    
    static public Expression<Func<Categorie,Categorie>> FilterViewableAttributes(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Func<Categorie,Categorie> FilterViewableAttributesLocal(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Categorie WithoutImages(Categorie self) {
      
      return self;
    }
  }

  
  
  public partial class Mediterranean: Categorie {
    public Mediterranean() {
      
    }
    
    
        public string Description {get;set;}
    
    static new public Expression<Func<Mediterranean,Mediterranean>> FilterViewableAttributes(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public new Func<Mediterranean,Mediterranean> FilterViewableAttributesLocal(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Mediterranean WithoutImages(Mediterranean self) {
      
      return self;
    }
  }

  
  
  public partial class Breakfast: Meal {
    public Breakfast() {
      
    }
    
    
        public string Description {get;set;}
    
    static new public Expression<Func<Breakfast,Breakfast>> FilterViewableAttributes(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public new Func<Breakfast,Breakfast> FilterViewableAttributesLocal(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Breakfast WithoutImages(Breakfast self) {
      
      return self;
    }
  }

  
  
  public partial class CategoryList: IEntity {
    public CategoryList() {
      
    }
    public int Id {get;set;}
    
    [Newtonsoft.Json.JsonProperty(ItemConverterType = typeof(Newtonsoft.Json.Converters.JavaScriptDateTimeConverter))] public DateTime CreatedDate{ get; set; }
        
    
    static public Expression<Func<CategoryList,CategoryList>> FilterViewableAttributes(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Func<CategoryList,CategoryList> FilterViewableAttributesLocal(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public CategoryList WithoutImages(CategoryList self) {
      
      return self;
    }
  }

  
  
  public partial class Rating: IEntity {
    public Rating() {
      Recipe_Ratings = new HashSet<Recipe_Rating>();
    }
    public int Id {get;set;}
    [Newtonsoft.Json.JsonIgnore] public virtual ICollection<Recipe_Rating> Recipe_Ratings {get;set;}
    [Newtonsoft.Json.JsonProperty(ItemConverterType = typeof(Newtonsoft.Json.Converters.JavaScriptDateTimeConverter))] public DateTime CreatedDate{ get; set; }
        public int rating {get;set;}
    
    static public Expression<Func<Rating,Rating>> FilterViewableAttributes(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Func<Rating,Rating> FilterViewableAttributesLocal(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Rating WithoutImages(Rating self) {
      
      return self;
    }
  }

  
  
  public partial class Bookmarks: IEntity {
    public Bookmarks() {
      
    }
    public int Id {get;set;}
    
    [Newtonsoft.Json.JsonProperty(ItemConverterType = typeof(Newtonsoft.Json.Converters.JavaScriptDateTimeConverter))] public DateTime CreatedDate{ get; set; }
        
    
    static public Expression<Func<Bookmarks,Bookmarks>> FilterViewableAttributes(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Func<Bookmarks,Bookmarks> FilterViewableAttributesLocal(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Bookmarks WithoutImages(Bookmarks self) {
      
      return self;
    }
  }

  
  
    public partial class Categorie_Meal {
    public Categorie_Meal() {
      
    }
    public int Id {get;set;}
    
    
        [Newtonsoft.Json.JsonIgnore] public virtual Categorie Categorie {get;set;}
    public int CategorieId {get;set;}
    [Newtonsoft.Json.JsonIgnore] public virtual Meal Meal {get;set;}
    public int MealId {get;set;}
    
    static public Expression<Func<Categorie_Meal,Categorie_Meal>> FilterViewableAttributes(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Func<Categorie_Meal,Categorie_Meal> FilterViewableAttributesLocal(User current_User, Admin current_Admin) {
      return self => self;
    }
    
  }

  
  

  public partial class User_Recipe {
    public User_Recipe() {
      
    }
    public int Id {get;set;}
    
    
        [Newtonsoft.Json.JsonIgnore] public virtual User User {get;set;}
    public int UserId {get;set;}
    [Newtonsoft.Json.JsonIgnore] public virtual Recipe Recipe {get;set;}
    public int RecipeId {get;set;}
    
    static public Expression<Func<User_Recipe,User_Recipe>> FilterViewableAttributes(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Func<User_Recipe,User_Recipe> FilterViewableAttributesLocal(User current_User, Admin current_Admin) {
      return self => self;
    }
    
  }

  
  

  public partial class Recipe_Rating {
    public Recipe_Rating() {
      
    }
    public int Id {get;set;}
    
    
        [Newtonsoft.Json.JsonIgnore] public virtual Recipe Recipe {get;set;}
    public int RecipeId {get;set;}
    [Newtonsoft.Json.JsonIgnore] public virtual Rating Rating {get;set;}
    public int RatingId {get;set;}
    
    static public Expression<Func<Recipe_Rating,Recipe_Rating>> FilterViewableAttributes(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Func<Recipe_Rating,Recipe_Rating> FilterViewableAttributesLocal(User current_User, Admin current_Admin) {
      return self => self;
    }
    
  }

  
  

  public partial class Meal_Recipe {
    public Meal_Recipe() {
      
    }
    public int Id {get;set;}
    
    
        [Newtonsoft.Json.JsonIgnore] public virtual Meal Meal {get;set;}
    public int MealId {get;set;}
    [Newtonsoft.Json.JsonIgnore] public virtual Recipe Recipe {get;set;}
    public int RecipeId {get;set;}
    
    static public Expression<Func<Meal_Recipe,Meal_Recipe>> FilterViewableAttributes(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Func<Meal_Recipe,Meal_Recipe> FilterViewableAttributesLocal(User current_User, Admin current_Admin) {
      return self => self;
    }
    
  }

  
  

  public partial class LoggableEntities {
  public User User {get;set;}
    public Admin Admin {get;set;}
}

  public partial class Session {
    public int Id {get;set;}
    public int? LoggedEntityId {get;set;}
    public string LoggedEntityName {get;set;}
    public string AdditionalInfo {get;set;}
    public string CookieName {get;set;}
    public string Content {get;set;}
    public DateTime CreatedAt {get;set;}
  }
}
