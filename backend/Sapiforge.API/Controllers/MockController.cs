namespace Sapiforge.API.Controllers;

using Microsoft.AspNetCore.Mvc;
using Sapiforge.Domain.Interfaces;
using Sapiforge.Domain.Models;

/// <summary>
/// Mock endpoint yönetimi ve eşleştirme endpoint'lerini sunar.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class MockController : ControllerBase
{
    private readonly IMockService _mockService;

    /// <summary>Bağımlılık dependency injection ile enjekte edilir</summary>
    public MockController(IMockService mockService)
    {
        _mockService = mockService;
    }

    /// <summary>
    /// Tüm mock endpoint'leri getirir.
    /// GET /api/mock
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var endpoints = await _mockService.GetAllAsync();
        return Ok(endpoints);
    }

    /// <summary>
    /// ID'ye göre mock endpoint getirir.
    /// GET /api/mock/{id}
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var endpoint = await _mockService.GetByIdAsync(id);
        if (endpoint == null)
            return NotFound($"ID {id} ile mock endpoint bulunamadı.");

        return Ok(endpoint);
    }

    /// <summary>
    /// Yeni mock endpoint oluşturur.
    /// POST /api/mock
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] MockEndpoint endpoint)
    {
        if (string.IsNullOrEmpty(endpoint.Path))
            return BadRequest("Path boş olamaz.");

        var created = await _mockService.CreateAsync(endpoint);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>
    /// Mock endpoint günceller.
    /// PUT /api/mock/{id}
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] MockEndpoint endpoint)
    {
        if (id != endpoint.Id)
            return BadRequest("ID uyuşmazlığı.");

        var updated = await _mockService.UpdateAsync(endpoint);
        return Ok(updated);
    }

    /// <summary>
    /// Mock endpoint siler.
    /// DELETE /api/mock/{id}
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _mockService.DeleteAsync(id);
        return NoContent();
    }

    /// <summary>
    /// Gelen isteği mock endpoint'lerle eşleştirir ve response döner.
    /// GET/POST/PUT/DELETE /api/mock/serve/{path}
    /// </summary>
    [HttpGet("serve/{**path}")]
    [HttpPost("serve/{**path}")]
    [HttpPut("serve/{**path}")]
    [HttpDelete("serve/{**path}")]
    public async Task<IActionResult> Serve(string path)
    {
        var method = Request.Method;
        var endpoint = await _mockService.MatchAsync("/" + path, method);

        if (endpoint == null)
            return NotFound($"/{path} için {method} mock endpoint bulunamadı.");

        Response.StatusCode = endpoint.StatusCode;
        return Content(endpoint.ResponseBody, "application/json");
    }
}