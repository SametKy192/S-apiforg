namespace Sapiforge.Domain.Models;

/// <summary>
/// Uygulamaya kayıtlı kullanıcıyı temsil eder.
/// JWT auth ile kimlik doğrulama yapılır.
/// </summary>
public class User
{
    /// <summary>Benzersiz kayıt kimliği</summary>
    public int Id { get; set; }

    /// <summary>Kullanıcının email adresi — giriş için kullanılır</summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>Şifrenin hash'lenmiş hali — düz metin saklanmaz</summary>
    public string PasswordHash { get; set; } = string.Empty;

    /// <summary>Kullanıcının adı</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>Kayıt tarihi (UTC)</summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}