using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace PortableRecipes.Models
{
    public partial class American: Categories {
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
      Categories_Meals = new HashSet<Categories_Meal>();
    }
    public int Id {get;set;}
    [Newtonsoft.Json.JsonIgnore] public virtual ICollection<Categories_Meal> Categories_Meals {get;set;}
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

  
  
  public partial class Asian: Categories {
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

  
  
  public partial class Recipes: IEntity {
    public Recipes() {
      User_Recipess = new HashSet<User_Recipes>();
      Dinner_Recipess = new HashSet<Dinner_Recipes>();
      Breakfast_Recipess = new HashSet<Breakfast_Recipes>();
      Lunch_Recipess = new HashSet<Lunch_Recipes>();
    }
    public int Id {get;set;}
    [Newtonsoft.Json.JsonIgnore] public virtual ICollection<User_Recipes> User_Recipess {get;set;}
    [Newtonsoft.Json.JsonIgnore] public virtual ICollection<Dinner_Recipes> Dinner_Recipess {get;set;}
    [Newtonsoft.Json.JsonIgnore] public virtual ICollection<Breakfast_Recipes> Breakfast_Recipess {get;set;}
    [Newtonsoft.Json.JsonIgnore] public virtual ICollection<Lunch_Recipes> Lunch_Recipess {get;set;}
    [Newtonsoft.Json.JsonProperty(ItemConverterType = typeof(Newtonsoft.Json.Converters.JavaScriptDateTimeConverter))] public DateTime CreatedDate{ get; set; }
        public string Picture {get;set;}
    public string Name {get;set;}
    public string Ingredients {get;set;}
    public string Description {get;set;}
    public int PreparationTime {get;set;}
    
    static public Expression<Func<Recipes,Recipes>> FilterViewableAttributes(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Func<Recipes,Recipes> FilterViewableAttributesLocal(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Recipes WithoutImages(Recipes self) {
      self.Picture = null;
      return self;
    }
  }

  
  
  public partial class Lunch: Meal {
    public Lunch() {
      Lunch_Recipess = new HashSet<Lunch_Recipes>();
    }
    [Newtonsoft.Json.JsonIgnore] public virtual ICollection<Lunch_Recipes> Lunch_Recipess {get;set;}
    
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
      User_Recipess = new HashSet<User_Recipes>();
    }
    public int Id {get;set;}
    [Newtonsoft.Json.JsonIgnore] public virtual ICollection<User_Recipes> User_Recipess {get;set;}
    [Newtonsoft.Json.JsonProperty(ItemConverterType = typeof(Newtonsoft.Json.Converters.JavaScriptDateTimeConverter))] public DateTime CreatedDate{ get; set; }
        public string Username {get;set;}
    public string Language {get;set;}
    public string Email {get;set;}
    [Newtonsoft.Json.JsonIgnore] public string PasswordHash {get;set;}
    [Newtonsoft.Json.JsonIgnore] public string PasswordSalt {get;set;}
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
      Dinner_Recipess = new HashSet<Dinner_Recipes>();
    }
    [Newtonsoft.Json.JsonIgnore] public virtual ICollection<Dinner_Recipes> Dinner_Recipess {get;set;}
    
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

  
  
  public partial class Mediterranean: Categories {
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
      Breakfast_Recipess = new HashSet<Breakfast_Recipes>();
    }
    [Newtonsoft.Json.JsonIgnore] public virtual ICollection<Breakfast_Recipes> Breakfast_Recipess {get;set;}
    
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

  
  
  public partial class Categories: IEntity {
    public Categories() {
      Categories_Meals = new HashSet<Categories_Meal>();
    }
    public int Id {get;set;}
    [Newtonsoft.Json.JsonIgnore] public virtual ICollection<Categories_Meal> Categories_Meals {get;set;}
    [Newtonsoft.Json.JsonProperty(ItemConverterType = typeof(Newtonsoft.Json.Converters.JavaScriptDateTimeConverter))] public DateTime CreatedDate{ get; set; }
    public string Kind {get { return this is American ? "American": this is Asian ? "Asian": this is Mediterranean ? "Mediterranean" : null; } }
    
    
    static public Expression<Func<Categories,Categories>> FilterViewableAttributes(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Func<Categories,Categories> FilterViewableAttributesLocal(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Categories WithoutImages(Categories self) {
      
      return self;
    }
  }

  
  
  public partial class Rating: IEntity {
    public Rating() {
      
    }
    public int Id {get;set;}
    
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

  
  
    public partial class Categories_Meal {
    public Categories_Meal() {
      
    }
    public int Id {get;set;}
    
    
        [Newtonsoft.Json.JsonIgnore] public virtual Categories Categories {get;set;}
    public int CategoriesId {get;set;}
    [Newtonsoft.Json.JsonIgnore] public virtual Meal Meal {get;set;}
    public int MealId {get;set;}
    
    static public Expression<Func<Categories_Meal,Categories_Meal>> FilterViewableAttributes(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Func<Categories_Meal,Categories_Meal> FilterViewableAttributesLocal(User current_User, Admin current_Admin) {
      return self => self;
    }
    
  }

  
  

  public partial class User_Recipes {
    public User_Recipes() {
      
    }
    public int Id {get;set;}
    
    
        [Newtonsoft.Json.JsonIgnore] public virtual User User {get;set;}
    public int UserId {get;set;}
    [Newtonsoft.Json.JsonIgnore] public virtual Recipes Recipes {get;set;}
    public int RecipesId {get;set;}
    
    static public Expression<Func<User_Recipes,User_Recipes>> FilterViewableAttributes(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Func<User_Recipes,User_Recipes> FilterViewableAttributesLocal(User current_User, Admin current_Admin) {
      return self => self;
    }
    
  }

  
  

  public partial class Dinner_Recipes {
    public Dinner_Recipes() {
      
    }
    public int Id {get;set;}
    
    
        [Newtonsoft.Json.JsonIgnore] public virtual Dinner Dinner {get;set;}
    public int DinnerId {get;set;}
    [Newtonsoft.Json.JsonIgnore] public virtual Recipes Recipes {get;set;}
    public int RecipesId {get;set;}
    
    static public Expression<Func<Dinner_Recipes,Dinner_Recipes>> FilterViewableAttributes(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Func<Dinner_Recipes,Dinner_Recipes> FilterViewableAttributesLocal(User current_User, Admin current_Admin) {
      return self => self;
    }
    
  }

  
  

  public partial class Breakfast_Recipes {
    public Breakfast_Recipes() {
      
    }
    public int Id {get;set;}
    
    
        [Newtonsoft.Json.JsonIgnore] public virtual Breakfast Breakfast {get;set;}
    public int BreakfastId {get;set;}
    [Newtonsoft.Json.JsonIgnore] public virtual Recipes Recipes {get;set;}
    public int RecipesId {get;set;}
    
    static public Expression<Func<Breakfast_Recipes,Breakfast_Recipes>> FilterViewableAttributes(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Func<Breakfast_Recipes,Breakfast_Recipes> FilterViewableAttributesLocal(User current_User, Admin current_Admin) {
      return self => self;
    }
    
  }

  
  

  public partial class Lunch_Recipes {
    public Lunch_Recipes() {
      
    }
    public int Id {get;set;}
    
    
        [Newtonsoft.Json.JsonIgnore] public virtual Lunch Lunch {get;set;}
    public int LunchId {get;set;}
    [Newtonsoft.Json.JsonIgnore] public virtual Recipes Recipes {get;set;}
    public int RecipesId {get;set;}
    
    static public Expression<Func<Lunch_Recipes,Lunch_Recipes>> FilterViewableAttributes(User current_User, Admin current_Admin) {
      return self => self;
    }
    static public Func<Lunch_Recipes,Lunch_Recipes> FilterViewableAttributesLocal(User current_User, Admin current_Admin) {
      return self => self;
    }
    
  }

  
  



  public partial class LoggableEntities {
  public User User {get;set;}
    public Admin Admin {get;set;}
}

  public partial class Session {
    public int Id {get;set;}
    public string CookieName {get;set;}
    public string Content {get;set;}
    public DateTime CreatedAt {get;set;}
  }
}
