namespace Sapiforge.Service;

using Sapiforge.Domain.Interfaces;
using Sapiforge.Domain.Models;

/// <summary>
/// Kullanıcı profil yönetimi iş mantığını yönetir.
/// IUserService interface'ini implemente eder.
/// </summary>
public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    /// <summary>Bağımlılık dependency injection ile enjekte edilir</summary>
    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    /// <summary>ID'ye göre kullanıcı getirir</summary>
    public async Task<User?> GetByIdAsync(int id)
    {
        return await _userRepository.GetByIdAsync(id);
    }

    /// <summary>
    /// Profil bilgilerini günceller.
    /// Email değiştirilmek isteniyorsa başka biri kullanıyor mu kontrol eder.
    /// </summary>
    public async Task<User> UpdateProfileAsync(int userId, string name, string email)
    {
        var user = await _userRepository.GetByIdAsync(userId)
            ?? throw new KeyNotFoundException("Kullanıcı bulunamadı.");

        // Email değiştiyse başkası kullanıyor mu kontrol et
        if (user.Email != email && await _userRepository.ExistsAsync(email))
            throw new ArgumentException("Bu email adresi zaten kullanılıyor.");

        user.Name = name;
        user.Email = email;

        return await _userRepository.UpdateAsync(user);
    }

    /// <summary>
    /// Şifreyi değiştirir.
    /// Mevcut şifre doğru mu kontrol eder, yeni şifreyi hash'ler.
    /// </summary>
    public async Task ChangePasswordAsync(int userId, string currentPassword, string newPassword)
    {
        var user = await _userRepository.GetByIdAsync(userId)
            ?? throw new KeyNotFoundException("Kullanıcı bulunamadı.");

        // Mevcut şifre doğru mu kontrol et
        if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash))
            throw new ArgumentException("Mevcut şifre hatalı.");

        // Yeni şifreyi hash'le ve kaydet
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        await _userRepository.UpdateAsync(user);
    }
}