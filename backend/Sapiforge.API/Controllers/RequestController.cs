namespace Sapiforge.API.Controllers;

using Microsoft.AspNetCore.Mvc;
using Sapiforge.Domain.Interfaces;
using Sapiforge.Domain.Models;
using Microsoft.AspNetCore.Authorization;

/// <summary>
/// API isteği gönderme ve geçmiş yönetimi endpoint'lerini sunar.
/// Proxy engine bu controller üzerinden çalışır.
/// </summary>
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class RequestController : ControllerBase
{
    private readonly IRequestService _requestService;

    /// <summary>Bağımlılık dependency injection ile enjekte edilir</summary>
    public RequestController(IRequestService requestService)
    {
        _requestService = requestService;
    }

    /// <summary>
    /// Dış API'ye istek gönderir ve response'u döndürür.
    /// POST /api/request/send
    /// </summary>
    [HttpPost("send")]
    public async Task<IActionResult> Send([FromBody] ApiRequest request)
    {
        if (string.IsNullOrEmpty(request.Url))
            return BadRequest("URL boş olamaz.");

        var response = await _requestService.SendRequestAsync(request);
        return Ok(response);
    }

    /// <summary>
    /// Tüm istek geçmişini getirir.
    /// GET /api/request/history
    /// </summary>
    [HttpGet("history")]
    public async Task<IActionResult> GetHistory()
    {
        var history = await _requestService.GetHistoryAsync();
        return Ok(history);
    }

    /// <summary>
    /// ID'ye göre tek bir isteği getirir.
    /// GET /api/request/{id}
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var request = await _requestService.GetByIdAsync(id);
        if (request == null)
            return NotFound($"ID {id} ile istek bulunamadı.");

        return Ok(request);
    }

    /// <summary>
    /// Geçmiş kaydını siler.
    /// DELETE /api/request/{id}
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _requestService.DeleteFromHistoryAsync(id);
        return NoContent();
    }
}