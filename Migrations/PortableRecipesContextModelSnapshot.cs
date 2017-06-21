using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using PortableRecipes.Models;

namespace PortableRecipes.Migrations
{
    [DbContext(typeof(PortableRecipesContext))]
    partial class PortableRecipesContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
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

            modelBuilder.Entity("PortableRecipes.Models.BookmarkedRecipes", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedDate");

                    b.Property<string>("Title");

                    b.HasKey("Id");

                    b.ToTable("BookmarkedRecipes");
                });

            modelBuilder.Entity("PortableRecipes.Models.Categories", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedDate");

                    b.Property<string>("Discriminator")
                        .IsRequired();

                    b.HasKey("Id");

                    b.ToTable("Categories");

                    b.HasDiscriminator<string>("Discriminator").HasValue("Categories");
                });

            modelBuilder.Entity("PortableRecipes.Models.HomePage", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedDate");

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

            modelBuilder.Entity("PortableRecipes.Models.Recipes", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedDate");

                    b.Property<string>("Description");

                    b.Property<string>("Ingredients");

                    b.Property<string>("Name");

                    b.Property<string>("Picture");

                    b.Property<int>("PreparationTime");

                    b.Property<int>("Rating");

                    b.HasKey("Id");

                    b.ToTable("Recipes");
                });

            modelBuilder.Entity("PortableRecipes.Models.Recommended_Recipes", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedDate");

                    b.HasKey("Id");

                    b.ToTable("Recommended_Recipes");
                });

            modelBuilder.Entity("PortableRecipes.Models.Session", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Content");

                    b.Property<string>("CookieName");

                    b.Property<DateTime>("CreatedAt");

                    b.HasKey("Id");

                    b.HasIndex("CookieName");

                    b.ToTable("Session");
                });

            modelBuilder.Entity("PortableRecipes.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedDate");

                    b.Property<string>("Email");

                    b.Property<string>("Language");

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

            modelBuilder.Entity("PortableRecipes.Models.American", b =>
                {
                    b.HasBaseType("PortableRecipes.Models.Categories");

                    b.Property<string>("Description");

                    b.ToTable("American");

                    b.HasDiscriminator().HasValue("American");
                });

            modelBuilder.Entity("PortableRecipes.Models.Asian", b =>
                {
                    b.HasBaseType("PortableRecipes.Models.Categories");

                    b.Property<string>("Description");

                    b.ToTable("Asian");

                    b.HasDiscriminator().HasValue("Asian");
                });

            modelBuilder.Entity("PortableRecipes.Models.Mediterranean", b =>
                {
                    b.HasBaseType("PortableRecipes.Models.Categories");

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
        }
    }
}
