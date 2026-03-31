namespace Sapiforge.Data.Repositories;

using Microsoft.EntityFrameworkCore;
using Sapiforge.Domain.Interfaces;
using Sapiforge.Domain.Models;

/// <summary>
/// API istek geçmişi için veritabanı işlemlerini yönetir.
/// IRequestRepository interface'ini implemente eder.
/// </summary>
public class RequestRepository : IRequestRepository
{
    private readonly AppDbContext _context;

    /// <summary>DbContext dependency injection ile enjekte edilir</summary>
    public RequestRepository(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>Tüm istekleri response'larıyla birlikte getirir</summary>
    public async Task<IEnumerable<ApiRequest>> GetAllAsync()
    {
        return await _context.Requests
            .Include(r => r.Response)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    /// <summary>ID'ye göre isteği response'uyla birlikte getirir</summary>
    public async Task<ApiRequest?> GetByIdAsync(int id)
    {
        return await _context.Requests
            .Include(r => r.Response)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    /// <summary>Yeni istek kaydeder ve ID atanmış halini döndürür</summary>
    public async Task<ApiRequest> AddAsync(ApiRequest request)
    {
        _context.Requests.Add(request);
        await _context.SaveChangesAsync();
        return request;
    }

    /// <summary>Response'u DB'ye kaydeder</summary>
    public async Task SaveResponseAsync(ApiResponse response)
    {
        _context.Responses.Add(response);
        await _context.SaveChangesAsync();
    }

    /// <summary>ID'ye göre isteği ve ilişkili response'u siler</summary>
    public async Task DeleteAsync(int id)
    {
        var request = await _context.Requests.FindAsync(id);
        if (request != null)
        {
            _context.Requests.Remove(request);
            await _context.SaveChangesAsync();
        }
    }
}