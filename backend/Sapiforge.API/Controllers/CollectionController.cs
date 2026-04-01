namespace Sapiforge.API.Controllers;

using Microsoft.AspNetCore.Mvc;
using Sapiforge.Domain.Interfaces;
using Sapiforge.Domain.Models;
using Microsoft.AspNetCore.Authorization;
/// <summary>
/// Koleksiyon yönetimi endpoint'lerini sunar.
/// </summary>
/// 
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CollectionController : ControllerBase
{
    private readonly ICollectionService _collectionService;

    /// <summary>Bağımlılık dependency injection ile enjekte edilir</summary>
    public CollectionController(ICollectionService collectionService)
    {
        _collectionService = collectionService;
    }

    /// <summary>
    /// Tüm koleksiyonları getirir.
    /// GET /api/collection
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var collections = await _collectionService.GetAllAsync();
        return Ok(collections);
    }

    /// <summary>
    /// ID'ye göre koleksiyonu içindeki isteklerle birlikte getirir.
    /// GET /api/collection/{id}
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var collection = await _collectionService.GetByIdAsync(id);
        if (collection == null)
            return NotFound($"ID {id} ile koleksiyon bulunamadı.");

        return Ok(collection);
    }

    /// <summary>
    /// Yeni koleksiyon oluşturur.
    /// POST /api/collection
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Collection collection)
    {
        if (string.IsNullOrEmpty(collection.Name))
            return BadRequest("Koleksiyon adı boş olamaz.");

        var created = await _collectionService.CreateAsync(collection);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>
    /// Koleksiyona istek ekler.
    /// POST /api/collection/{id}/items
    /// </summary>
    [HttpPost("{id}/items")]
    public async Task<IActionResult> AddItem(int id, [FromBody] int requestId)
    {
        await _collectionService.AddItemAsync(id, requestId);
        return NoContent();
    }

    /// <summary>
    /// Koleksiyonu siler.
    /// DELETE /api/collection/{id}
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _collectionService.DeleteAsync(id);
        return NoContent();
    }
}