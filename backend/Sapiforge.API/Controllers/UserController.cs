namespace Sapiforge.API.Controllers;

using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sapiforge.Domain.Interfaces;

/// <summary>
/// Kullanıcı profil ve şifre yönetimi endpoint'lerini sunar.
/// </summary>
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    /// <summary>
    /// Giriş yapan kullanıcının profil bilgilerini getirir.
    /// GET /api/user/profile
    /// </summary>
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var user = await _userService.GetByIdAsync(userId);
        if (user == null) return NotFound();

        return Ok(new { user.Id, user.Name, user.Email, user.CreatedAt });
    }

    /// <summary>
    /// Profil bilgilerini günceller.
    /// PUT /api/user/profile
    /// </summary>
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var user = await _userService.UpdateProfileAsync(userId, request.Name, request.Email);
        return Ok(new { user.Id, user.Name, user.Email });
    }

    /// <summary>
    /// Şifreyi değiştirir.
    /// PUT /api/user/password
    /// </summary>
    [HttpPut("password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        await _userService.ChangePasswordAsync(userId, request.CurrentPassword, request.NewPassword);
        return Ok(new { message = "Şifre başarıyla değiştirildi." });
    }
}

/// <summary>Profil güncelleme isteği için DTO</summary>
public record UpdateProfileRequest(string Name, string Email);

/// <summary>Şifre değiştirme isteği için DTO</summary>
public record ChangePasswordRequest(string CurrentPassword, string NewPassword);