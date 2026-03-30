namespace Sapiforge.Data;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

/// <summary>
/// EF Core migration'ları çalıştırırken DbContext oluşturmak için kullanılır.
/// Sadece tasarım zamanında (migration) devreye girer, runtime'da kullanılmaz.
/// </summary>
public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseNpgsql("Host=localhost;Database=sapiforge;Username=postgres;Password=postgres");
        return new AppDbContext(optionsBuilder.Options);    }
}