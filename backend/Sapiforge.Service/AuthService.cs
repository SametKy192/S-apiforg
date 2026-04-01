namespace Sapiforge.Service;

using Sapiforge.Domain.Interfaces;
using Sapiforge.Domain.Models;

/// <summary>
/// Kullanıcı kayıt ve giriş iş mantığını yönetir.
/// IAuthService interface'ini implemente eder.
/// </summary>
public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenService _tokenService;

    /// <summary>Bağımlılıklar dependency injection ile enjekte edilir</summary>
    public AuthService(IUserRepository userRepository, ITokenService tokenService)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
    }

    /// <summary>
    /// Yeni kullanıcı kaydı oluşturur.
    /// Şifreyi hash'ler, DB'ye kaydeder ve JWT token döndürür.
    /// </summary>
    public async Task<string> RegisterAsync(string name, string email, string password)
    {
        // Email zaten kayıtlı mı kontrol et
        if (await _userRepository.ExistsAsync(email))
            throw new ArgumentException("Bu email adresi zaten kayıtlı.");

        // Şifreyi hash'le — düz metin saklanmaz
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);

        var user = new User
        {
            Name = name,
            Email = email,
            PasswordHash = passwordHash
        };

        var savedUser = await _userRepository.AddAsync(user);

        return _tokenService.GenerateToken(savedUser.Id.ToString(), savedUser.Email);
    }

    /// <summary>
    /// Email ve şifre ile giriş yapar.
    /// Şifreyi hash ile karşılaştırır, JWT token döndürür.
    /// </summary>
    public async Task<string> LoginAsync(string email, string password)
    {
        var user = await _userRepository.GetByEmailAsync(email);

        if (user == null)
            throw new KeyNotFoundException("Email veya şifre hatalı.");

        // Şifre doğru mu kontrol et
        if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            throw new KeyNotFoundException("Email veya şifre hatalı.");

        return _tokenService.GenerateToken(user.Id.ToString(), user.Email);
    }
}