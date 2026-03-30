namespace Sapiforge.Domain.Models;

/// <summary>
/// Kullanıcının gönderdiği API isteğini temsil eder.
/// Proxy engine üzerinden dış API'ye iletilen her istek bu modelle saklanır.
/// </summary>
public class ApiRequest
{
    /// <summary>Benzersiz kayıt kimliği</summary>
    public int Id { get; set; }

    /// <summary>İsteğin gönderileceği hedef URL</summary>
    public string Url { get; set; } = string.Empty;

    /// <summary>HTTP metodu: GET, POST, PUT, DELETE, PATCH</summary>
    public string Method { get; set; } = "GET";

    /// <summary>İstek header'ları JSON formatında saklanır</summary>
    public string? Headers { get; set; }

    /// <summary>İstek body'si — POST/PUT isteklerinde kullanılır</summary>
    public string? Body { get; set; }

    /// <summary>İsteğin oluşturulma tarihi (UTC)</summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>Bu isteğe ait response — navigation property</summary>
    public ApiResponse? Response { get; set; }
}