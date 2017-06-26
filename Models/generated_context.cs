using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace PortableRecipes.Models{
  public partial class PortableRecipesContext {
    public DbSet<American> American { get; set; }
    public DbSet<Meal> Meal { get; set; }
    public DbSet<Asian> Asian { get; set; }
    public DbSet<Lunch> Lunch { get; set; }
    public DbSet<User> User { get; set; }
    public DbSet<HomePage> HomePage { get; set; }
    public DbSet<Recipe> Recipe { get; set; }
    public DbSet<Admin> Admin { get; set; }
    public DbSet<Dinner> Dinner { get; set; }
    public DbSet<Categorie> Categorie { get; set; }
    public DbSet<Mediterranean> Mediterranean { get; set; }
    public DbSet<Breakfast> Breakfast { get; set; }
    public DbSet<CategoryList> CategoryList { get; set; }
    public DbSet<Rating> Rating { get; set; }
    public DbSet<Bookmarks> Bookmarks { get; set; }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    public DbSet<Categorie_Meal> Categorie_Meal { get; set; }
    public DbSet<User_Recipe> User_Recipe { get; set; }
    public DbSet<Recipe_Rating> Recipe_Rating { get; set; }
    public DbSet<Meal_Recipe> Meal_Recipe { get; set; }
    public DbSet<Session> Session { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {

      modelBuilder.Entity<User>()
              .HasIndex(b => b.Username)
              .IsUnique();
      modelBuilder.Entity<User>()
              .HasIndex(b => b.Email)
              .IsUnique();

      modelBuilder.Entity<Admin>()
              .HasIndex(b => b.Username)
              .IsUnique();
      modelBuilder.Entity<Admin>()
              .HasIndex(b => b.Email)
              .IsUnique();



  
    
    
    
    
    
    
    
    
    
    
    
    
    
    

  
      modelBuilder.Entity<Session>()
        .HasIndex(b => b.CookieName);
      modelBuilder.Entity<Session>()
        .HasIndex(b => b.LoggedEntityName);
      modelBuilder.Entity<Session>()
        .HasIndex(b => b.LoggedEntityId);
      modelBuilder.Entity<Session>()
        .HasIndex(b => b.CreatedAt);
    }
  }
}
    