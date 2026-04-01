namespace Sapiforge.API.Controllers;

using Microsoft.AspNetCore.Mvc;
using Sapiforge.Domain.Interfaces;

/// <summary>
/// Kullanıcı kayıt ve giriş endpoint'lerini sunar.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Yeni kullanıcı kaydı oluşturur.
    /// POST /api/auth/register
    /// </summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            return BadRequest("Email ve şifre zorunludur.");

        var token = await _authService.RegisterAsync(request.Name, request.Email, request.Password);
        return Ok(new { token });
    }

    /// <summary>
    /// Kullanıcı girişi yapar, JWT token döndürür.
    /// POST /api/auth/login
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            return BadRequest("Email ve şifre zorunludur.");

        var token = await _authService.LoginAsync(request.Email, request.Password);
        return Ok(new { token });
    }
}

/// <summary>Register isteği için DTO</summary>
public record RegisterRequest(string Name, string Email, string Password);

/// <summary>Login isteği için DTO</summary>
public record LoginRequest(string Email, string Password);