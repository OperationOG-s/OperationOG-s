using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using PortableRecipes.Models;

namespace PortableRecipes.Migrations
{
    [DbContext(typeof(PortableRecipesContext))]
    [Migration("20170704072215_SpecChange_20170704912204")]
    partial class SpecChange_20170704912204
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.1");

            modelBuilder.Entity("PortableRecipes.Models.Admin", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedDate");

                    b.Property<string>("Email");

                    b.Property<string>("Language");

                    b.Property<DateTime>("LastLoginAttempt");

                    b.Property<string>("PasswordHash");

                    b.Property<string>("PasswordSalt");

                    b.Property<string>("Username");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.HasIndex("Username")
                        .IsUnique();

                    b.ToTable("Admin");
                });

            modelBuilder.Entity("PortableRecipes.Models.Bookmarks", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedDate");

                    b.HasKey("Id");

                    b.ToTable("Bookmarks");
                });

            modelBuilder.Entity("PortableRecipes.Models.Categorie", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedDate");

                    b.Property<string>("Discriminator")
                        .IsRequired();

                    b.HasKey("Id");

                    b.ToTable("Categorie");

                    b.HasDiscriminator<string>("Discriminator").HasValue("Categorie");
                });

            modelBuilder.Entity("PortableRecipes.Models.Categorie_Meal", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("CategorieId");

                    b.Property<int>("MealId");

                    b.HasKey("Id");

                    b.HasIndex("CategorieId");

                    b.HasIndex("MealId");

                    b.ToTable("Categorie_Meal");
                });

            modelBuilder.Entity("PortableRecipes.Models.Categorie_Recipe", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("CategorieId");

                    b.Property<int>("RecipeId");

                    b.HasKey("Id");

                    b.HasIndex("CategorieId");

                    b.HasIndex("RecipeId");

                    b.ToTable("Categorie_Recipe");
                });

            modelBuilder.Entity("PortableRecipes.Models.CategoryList", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedDate");

                    b.HasKey("Id");

                    b.ToTable("CategoryList");
                });

            modelBuilder.Entity("PortableRecipes.Models.HomePage", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedDate");

                    b.Property<string>("Test");

                    b.HasKey("Id");

                    b.ToTable("HomePage");
                });

            modelBuilder.Entity("PortableRecipes.Models.Meal", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedDate");

                    b.Property<string>("Discriminator")
                        .IsRequired();

                    b.HasKey("Id");

                    b.ToTable("Meal");

                    b.HasDiscriminator<string>("Discriminator").HasValue("Meal");
                });

            modelBuilder.Entity("PortableRecipes.Models.Meal_Recipe", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("MealId");

                    b.Property<int>("RecipeId");

                    b.HasKey("Id");

                    b.HasIndex("MealId");

                    b.HasIndex("RecipeId");

                    b.ToTable("Meal_Recipe");
                });

            modelBuilder.Entity("PortableRecipes.Models.Rating", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedDate");

                    b.Property<int>("rating");

                    b.HasKey("Id");

                    b.ToTable("Rating");
                });

            modelBuilder.Entity("PortableRecipes.Models.Recipe", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedDate");

                    b.Property<string>("Description");

                    b.Property<string>("Ingredients");

                    b.Property<string>("Name");

                    b.Property<string>("Picture");

                    b.Property<int>("PreparationTime");

                    b.HasKey("Id");

                    b.ToTable("Recipe");
                });

            modelBuilder.Entity("PortableRecipes.Models.Recipe_Rating", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("RatingId");

                    b.Property<int>("RecipeId");

                    b.HasKey("Id");

                    b.HasIndex("RatingId");

                    b.HasIndex("RecipeId");

                    b.ToTable("Recipe_Rating");
                });

            modelBuilder.Entity("PortableRecipes.Models.Session", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("AdditionalInfo");

                    b.Property<string>("Content");

                    b.Property<string>("CookieName");

                    b.Property<DateTime>("CreatedAt");

                    b.Property<int?>("LoggedEntityId");

                    b.Property<string>("LoggedEntityName");

                    b.HasKey("Id");

                    b.HasIndex("CookieName");

                    b.HasIndex("CreatedAt");

                    b.HasIndex("LoggedEntityId");

                    b.HasIndex("LoggedEntityName");

                    b.ToTable("Session");
                });

            modelBuilder.Entity("PortableRecipes.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedDate");

                    b.Property<string>("Email");

                    b.Property<string>("Language");

                    b.Property<DateTime>("LastLoginAttempt");

                    b.Property<string>("PasswordHash");

                    b.Property<string>("PasswordSalt");

                    b.Property<string>("Username");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.HasIndex("Username")
                        .IsUnique();

                    b.ToTable("User");
                });

            modelBuilder.Entity("PortableRecipes.Models.User_Rating", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("RatingId");

                    b.Property<int>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("RatingId");

                    b.HasIndex("UserId");

                    b.ToTable("User_Rating");
                });

            modelBuilder.Entity("PortableRecipes.Models.User_Recipe", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("RecipeId");

                    b.Property<int>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("RecipeId");

                    b.HasIndex("UserId");

                    b.ToTable("User_Recipe");
                });

            modelBuilder.Entity("PortableRecipes.Models.American", b =>
                {
                    b.HasBaseType("PortableRecipes.Models.Categorie");

                    b.Property<string>("Description");

                    b.ToTable("American");

                    b.HasDiscriminator().HasValue("American");
                });

            modelBuilder.Entity("PortableRecipes.Models.Asian", b =>
                {
                    b.HasBaseType("PortableRecipes.Models.Categorie");

                    b.Property<string>("Description");

                    b.ToTable("Asian");

                    b.HasDiscriminator().HasValue("Asian");
                });

            modelBuilder.Entity("PortableRecipes.Models.Mediterranean", b =>
                {
                    b.HasBaseType("PortableRecipes.Models.Categorie");

                    b.Property<string>("Description");

                    b.ToTable("Mediterranean");

                    b.HasDiscriminator().HasValue("Mediterranean");
                });

            modelBuilder.Entity("PortableRecipes.Models.Breakfast", b =>
                {
                    b.HasBaseType("PortableRecipes.Models.Meal");

                    b.Property<string>("Description");

                    b.ToTable("Breakfast");

                    b.HasDiscriminator().HasValue("Breakfast");
                });

            modelBuilder.Entity("PortableRecipes.Models.Dinner", b =>
                {
                    b.HasBaseType("PortableRecipes.Models.Meal");

                    b.Property<string>("Description");

                    b.ToTable("Dinner");

                    b.HasDiscriminator().HasValue("Dinner");
                });

            modelBuilder.Entity("PortableRecipes.Models.Lunch", b =>
                {
                    b.HasBaseType("PortableRecipes.Models.Meal");

                    b.Property<string>("Description");

                    b.ToTable("Lunch");

                    b.HasDiscriminator().HasValue("Lunch");
                });

            modelBuilder.Entity("PortableRecipes.Models.Categorie_Meal", b =>
                {
                    b.HasOne("PortableRecipes.Models.Categorie", "Categorie")
                        .WithMany("Categorie_Meals")
                        .HasForeignKey("CategorieId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PortableRecipes.Models.Meal", "Meal")
                        .WithMany("Categorie_Meals")
                        .HasForeignKey("MealId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("PortableRecipes.Models.Categorie_Recipe", b =>
                {
                    b.HasOne("PortableRecipes.Models.Categorie", "Categorie")
                        .WithMany("Categorie_Recipes")
                        .HasForeignKey("CategorieId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PortableRecipes.Models.Recipe", "Recipe")
                        .WithMany("Categorie_Recipes")
                        .HasForeignKey("RecipeId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("PortableRecipes.Models.Meal_Recipe", b =>
                {
                    b.HasOne("PortableRecipes.Models.Meal", "Meal")
                        .WithMany("Meal_Recipes")
                        .HasForeignKey("MealId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PortableRecipes.Models.Recipe", "Recipe")
                        .WithMany("Meal_Recipes")
                        .HasForeignKey("RecipeId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("PortableRecipes.Models.Recipe_Rating", b =>
                {
                    b.HasOne("PortableRecipes.Models.Rating", "Rating")
                        .WithMany("Recipe_Ratings")
                        .HasForeignKey("RatingId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PortableRecipes.Models.Recipe", "Recipe")
                        .WithMany("Recipe_Ratings")
                        .HasForeignKey("RecipeId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("PortableRecipes.Models.User_Rating", b =>
                {
                    b.HasOne("PortableRecipes.Models.Rating", "Rating")
                        .WithMany("User_Ratings")
                        .HasForeignKey("RatingId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PortableRecipes.Models.User", "User")
                        .WithMany("User_Ratings")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("PortableRecipes.Models.User_Recipe", b =>
                {
                    b.HasOne("PortableRecipes.Models.Recipe", "Recipe")
                        .WithMany("User_Recipes")
                        .HasForeignKey("RecipeId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PortableRecipes.Models.User", "User")
                        .WithMany("User_Recipes")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
        }
    }
}
