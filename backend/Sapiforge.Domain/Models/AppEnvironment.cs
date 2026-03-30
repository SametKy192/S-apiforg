namespace Sapiforge.Domain.Models;

/// <summary>
/// Ortam değişkenlerini gruplamak için kullanılan modeldir.
/// Dev, staging, prod gibi farklı ortamlar için ayrı değişken setleri tanımlanır.
/// </summary>
public class AppEnvironment
{
    /// <summary>Benzersiz kayıt kimliği</summary>
    public int Id { get; set; }

    /// <summary>Ortam adı — örnek: "Production", "Staging"</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Ortama ait değişkenler JSON formatında saklanır.
    /// Örnek: {"baseUrl": "https://api.example.com", "token": "abc123"}
    /// </summary>
    public string Variables { get; set; } = "{}";

    /// <summary>Bu ortamın aktif olup olmadığı — sadece bir ortam aktif olabilir</summary>
    public bool IsActive { get; set; } = false;

    /// <summary>Oluşturulma tarihi (UTC)</summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}