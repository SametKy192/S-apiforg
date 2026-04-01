namespace Sapiforge.Domain.Interfaces;

/// <summary>
/// JWT token üretimi ve doğrulaması için servis sözleşmesi.
/// Service katmanındaki TokenService bu interface'i implemente eder.
/// </summary>
public interface ITokenService
{
    /// <summary>Kullanıcı ID'si ve email ile JWT token üretir</summary>
    string GenerateToken(string userId, string email);

    /// <summary>Token'ın geçerli olup olmadığını kontrol eder</summary>
    bool ValidateToken(string token);
}