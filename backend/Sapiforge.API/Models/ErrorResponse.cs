namespace Sapiforge.API.Models;

/// <summary>
/// API'nin hata durumunda döndürdüğü standart response modeli.
/// Tüm hatalar bu format ile döner.
/// </summary>
public class ErrorResponse
{
    /// <summary>HTTP durum kodu</summary>
    public int StatusCode { get; set; }

    /// <summary>Kullanıcıya gösterilecek hata mesajı</summary>
    public string Message { get; set; } = string.Empty;

    /// <summary>Hatanın oluştuğu tarih (UTC)</summary>
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}