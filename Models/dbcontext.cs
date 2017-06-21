using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace PortableRecipes.Models{
  public partial class PortableRecipesContext : DbContext {

      public PortableRecipesContext(DbContextOptions<PortableRecipesContext> options) : base(options){}
  }
}
