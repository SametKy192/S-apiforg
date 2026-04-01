namespace Sapiforge.Domain.Interfaces;

using Sapiforge.Domain.Models;

/// <summary>
/// Kullanıcı profil yönetimi için servis sözleşmesi.
/// Service katmanındaki UserService bu interface'i implemente eder.
/// </summary>
public interface IUserService
{
    /// <summary>ID'ye göre kullanıcı getirir</summary>
    Task<User?> GetByIdAsync(int id);

    /// <summary>Profil bilgilerini günceller</summary>
    Task<User> UpdateProfileAsync(int userId, string name, string email);

    /// <summary>Şifreyi değiştirir</summary>
    Task ChangePasswordAsync(int userId, string currentPassword, string newPassword);
}