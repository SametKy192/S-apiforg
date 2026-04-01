namespace Sapiforge.Domain.Interfaces;

using Sapiforge.Domain.Models;

/// <summary>
/// Kullanıcı kayıt ve giriş işlemleri için servis sözleşmesi.
/// Service katmanındaki AuthService bu interface'i implemente eder.
/// </summary>
public interface IAuthService
{
    /// <summary>Yeni kullanıcı kaydı oluşturur, JWT token döndürür</summary>
    Task<string> RegisterAsync(string name, string email, string password);

    /// <summary>Email ve şifre ile giriş yapar, JWT token döndürür</summary>
    Task<string> LoginAsync(string email, string password);
}