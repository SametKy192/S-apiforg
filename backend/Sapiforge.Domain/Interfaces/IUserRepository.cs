namespace Sapiforge.Domain.Interfaces;

using Sapiforge.Domain.Models;

/// <summary>
/// Kullanıcı yönetimi için veri erişim sözleşmesi.
/// Data katmanındaki UserRepository bu interface'i implemente eder.
/// </summary>
public interface IUserRepository
{
    /// <summary>Email'e göre kullanıcı getirir</summary>
    Task<User?> GetByEmailAsync(string email);

    /// <summary>ID'ye göre kullanıcı getirir</summary>
    Task<User?> GetByIdAsync(int id);

    /// <summary>Yeni kullanıcı kaydeder</summary>
    Task<User> AddAsync(User user);

    /// <summary>Email adresi kayıtlı mı kontrol eder</summary>
    Task<bool> ExistsAsync(string email);

    /// <summary>Kullanıcı bilgilerini günceller</summary>
    Task<User> UpdateAsync(User user);
}