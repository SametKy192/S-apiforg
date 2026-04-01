namespace Sapiforge.Data;

using Microsoft.EntityFrameworkCore;
using Sapiforge.Domain.Models;

/// <summary>
/// Uygulamanın veritabanı bağlamı.
/// Tüm entity'leri ve ilişkilerini yönetir.
/// EF Core bu sınıf üzerinden veritabanıyla iletişim kurar.
/// </summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    /// <summary>API istek geçmişi tablosu</summary>
    public DbSet<ApiRequest> Requests { get; set; }

    /// <summary>API response geçmişi tablosu</summary>
    public DbSet<ApiResponse> Responses { get; set; }

    /// <summary>Mock endpoint'ler tablosu</summary>
    public DbSet<MockEndpoint> MockEndpoints { get; set; }

    /// <summary>Koleksiyonlar tablosu</summary>
    public DbSet<Collection> Collections { get; set; }

    /// <summary>Koleksiyon öğeleri tablosu</summary>
    public DbSet<CollectionItem> CollectionItems { get; set; }

    /// <summary>Ortam değişkenleri tablosu</summary>
    public DbSet<AppEnvironment> Environments { get; set; }

    /// <summary>Kullanıcılar tablosu</summary>
    public DbSet<User> Users { get; set; }

    /// <summary>
    /// Entity ilişkilerini ve kısıtlamalarını yapılandırır.
    /// Fluent API ile tablo ve kolon ayarları burada tanımlanır.
    /// </summary>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        /// ApiRequest — ApiResponse: 1'e 1 ilişki
        modelBuilder.Entity<ApiRequest>()
            .HasOne(r => r.Response)
            .WithOne(r => r.Request)
            .HasForeignKey<ApiResponse>(r => r.ApiRequestId)
            .OnDelete(DeleteBehavior.Cascade);

        /// Collection — CollectionItem: 1'e çok ilişki
        modelBuilder.Entity<Collection>()
            .HasMany(c => c.Items)
            .WithOne(i => i.Collection)
            .HasForeignKey(i => i.CollectionId)
            .OnDelete(DeleteBehavior.Cascade);

        /// CollectionItem — ApiRequest ilişkisi
        modelBuilder.Entity<CollectionItem>()
            .HasOne(i => i.Request)
            .WithMany()
            .HasForeignKey(i => i.ApiRequestId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}