namespace Sapiforge.Domain.Models;

/// <summary>
/// Dış API'den dönen response verisini temsil eder.
/// Her ApiRequest'e ait tek bir ApiResponse olur (1-1 ilişki).
/// </summary>
public class ApiResponse
{
    /// <summary>Benzersiz kayıt kimliği</summary>
    public int Id { get; set; }

    /// <summary>Bu response'un ait olduğu isteğin kimliği (foreign key)</summary>
    public int ApiRequestId { get; set; }

    /// <summary>HTTP durum kodu: 200, 404, 500 vb.</summary>
    public int StatusCode { get; set; }

    /// <summary>Response body — JSON, XML veya düz metin olabilir</summary>
    public string? Body { get; set; }

    /// <summary>Response header'ları JSON formatında saklanır</summary>
    public string? Headers { get; set; }

    /// <summary>İsteğin tamamlanma süresi (milisaniye)</summary>
    public long DurationMs { get; set; }

    /// <summary>Response boyutu (byte)</summary>
    public long SizeBytes { get; set; }

    /// <summary>Response'un alındığı tarih (UTC)</summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>İlişkili istek nesnesi — navigation property</summary>
    public ApiRequest Request { get; set; } = null!;
}