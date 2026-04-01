namespace Sapiforge.API.Controllers;

using Microsoft.AspNetCore.Mvc;
using Sapiforge.Domain.Interfaces;
using Sapiforge.Domain.Models;
using Microsoft.AspNetCore.Authorization;

/// <summary>
/// Ortam değişkenleri yönetimi endpoint'lerini sunar.
/// </summary>
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class EnvironmentController : ControllerBase
{
    private readonly IEnvironmentService _environmentService;

    /// <summary>Bağımlılık dependency injection ile enjekte edilir</summary>
    public EnvironmentController(IEnvironmentService environmentService)
    {
        _environmentService = environmentService;
    }

    /// <summary>
    /// Tüm ortamları getirir.
    /// GET /api/environment
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var environments = await _environmentService.GetAllAsync();
        return Ok(environments);
    }

    /// <summary>
    /// Aktif ortamı getirir.
    /// GET /api/environment/active
    /// </summary>
    [HttpGet("active")]
    public async Task<IActionResult> GetActive()
    {
        var environment = await _environmentService.GetActiveAsync();
        if (environment == null)
            return NotFound("Aktif ortam bulunamadı.");

        return Ok(environment);
    }

    /// <summary>
    /// Yeni ortam oluşturur.
    /// POST /api/environment
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] AppEnvironment environment)
    {
        if (string.IsNullOrEmpty(environment.Name))
            return BadRequest("Ortam adı boş olamaz.");

        var created = await _environmentService.CreateAsync(environment);
        return CreatedAtAction(nameof(GetAll), new { id = created.Id }, created);
    }

    /// <summary>
    /// Ortamı günceller.
    /// PUT /api/environment/{id}
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] AppEnvironment environment)
    {
        if (id != environment.Id)
            return BadRequest("ID uyuşmazlığı.");

        var updated = await _environmentService.UpdateAsync(environment);
        return Ok(updated);
    }

    /// <summary>
    /// Ortamı siler.
    /// DELETE /api/environment/{id}
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _environmentService.DeleteAsync(id);
        return NoContent();
    }
}