namespace Sapiforge.Domain.Models;

/// <summary>
/// Kullanıcının tanımladığı sahte (mock) API endpoint'ini temsil eder.
/// Gerçek bir backend olmadan frontend geliştirme yapmak için kullanılır.
/// </summary>
public class MockEndpoint
{
    /// <summary>Benzersiz kayıt kimliği</summary>
    public int Id { get; set; }

    /// <summary>Mock endpoint'in path'i — örnek: /api/users</summary>
    public string Path { get; set; } = string.Empty;

    /// <summary>HTTP metodu: GET, POST, PUT, DELETE, PATCH</summary>
    public string Method { get; set; } = "GET";

    /// <summary>Bu endpoint'e istek geldiğinde dönecek response body (JSON)</summary>
    public string ResponseBody { get; set; } = "{}";

    /// <summary>Dönecek HTTP durum kodu — varsayılan 200</summary>
    public int StatusCode { get; set; } = 200;

    /// <summary>Response header'ları JSON formatında — örnek: Content-Type</summary>
    public string? ResponseHeaders { get; set; }

    /// <summary>Endpoint'in aktif olup olmadığı — pasif endpoint'e istek gelmez</summary>
    public bool IsActive { get; set; } = true;

    /// <summary>Oluşturulma tarihi (UTC)</summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}