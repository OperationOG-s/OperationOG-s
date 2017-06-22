using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace PortableRecipes.Models{
  public partial class PortableRecipesContext {
    public DbSet<American> American { get; set; }
    public DbSet<Meal> Meal { get; set; }
    public DbSet<Asian> Asian { get; set; }
    public DbSet<Recipes> Recipes { get; set; }
    public DbSet<Lunch> Lunch { get; set; }
    public DbSet<User> User { get; set; }
    public DbSet<HomePage> HomePage { get; set; }
    public DbSet<Admin> Admin { get; set; }
    public DbSet<Dinner> Dinner { get; set; }
    public DbSet<Mediterranean> Mediterranean { get; set; }
    public DbSet<Breakfast> Breakfast { get; set; }
    public DbSet<Categories> Categories { get; set; }
    public DbSet<Rating> Rating { get; set; }
    
    
    
    
    
    
    
    
    
    
    
    
    
    public DbSet<Categories_Meal> Categories_Meal { get; set; }
    public DbSet<User_Recipes> User_Recipes { get; set; }
    public DbSet<Dinner_Recipes> Dinner_Recipes { get; set; }
    public DbSet<Breakfast_Recipes> Breakfast_Recipes { get; set; }
    public DbSet<Lunch_Recipes> Lunch_Recipes { get; set; }
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
    }
  }
}
    