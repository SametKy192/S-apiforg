namespace Sapiforge.Domain.Models;

/// <summary>
/// API isteklerini gruplamak için kullanılan koleksiyon modelidir.
/// Postman'daki koleksiyon mantığıyla aynı şekilde çalışır.
/// </summary>
public class Collection
{
    /// <summary>Benzersiz kayıt kimliği</summary>
    public int Id { get; set; }

    /// <summary>Koleksiyonun adı — örnek: "Auth Endpoints"</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>Koleksiyonun açıklaması — opsiyonel</summary>
    public string? Description { get; set; }

    /// <summary>Oluşturulma tarihi (UTC)</summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>Bu koleksiyona ait istekler — navigation property</summary>
    public ICollection<CollectionItem> Items { get; set; } = new List<CollectionItem>();
}