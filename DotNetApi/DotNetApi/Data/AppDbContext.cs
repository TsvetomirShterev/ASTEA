using DotNetApi.Models;
using Microsoft.EntityFrameworkCore;

namespace DotNetApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Username = "Pesho", Email = "Pesho@gmail.com", Password = "Pass" },
                new User { Id = 2, Username = "Gosho", Email = "Gosho@gmail.com", Password = "12345" }
            );
        }
    }
}
