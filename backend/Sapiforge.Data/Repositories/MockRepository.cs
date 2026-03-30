namespace Sapiforge.Data.Repositories;

using Microsoft.EntityFrameworkCore;
using Sapiforge.Domain.Interfaces;
using Sapiforge.Domain.Models;

/// <summary>
/// Mock endpoint yönetimi için veritabanı işlemlerini yönetir.
/// IMockRepository interface'ini implemente eder.
/// </summary>
public class MockRepository : IMockRepository
{
    private readonly AppDbContext _context;

    /// <summary>DbContext dependency injection ile enjekte edilir</summary>
    public MockRepository(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>Tüm mock endpoint'leri getirir</summary>
    public async Task<IEnumerable<MockEndpoint>> GetAllAsync()
    {
        return await _context.MockEndpoints
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync();
    }

    /// <summary>ID'ye göre mock endpoint getirir</summary>
    public async Task<MockEndpoint?> GetByIdAsync(int id)
    {
        return await _context.MockEndpoints.FindAsync(id);
    }

    /// <summary>
    /// Path ve method'a göre aktif mock endpoint arar.
    /// Mock engine gelen isteği bu metod ile eşleştirir.
    /// </summary>
    public async Task<MockEndpoint?> GetByPathAndMethodAsync(string path, string method)
    {
        return await _context.MockEndpoints
            .FirstOrDefaultAsync(m =>
                m.Path == path &&
                m.Method == method &&
                m.IsActive);
    }

    /// <summary>Yeni mock endpoint kaydeder</summary>
    public async Task<MockEndpoint> AddAsync(MockEndpoint endpoint)
    {
        _context.MockEndpoints.Add(endpoint);
        await _context.SaveChangesAsync();
        return endpoint;
    }

    /// <summary>Mevcut mock endpoint'i günceller</summary>
    public async Task<MockEndpoint> UpdateAsync(MockEndpoint endpoint)
    {
        _context.MockEndpoints.Update(endpoint);
        await _context.SaveChangesAsync();
        return endpoint;
    }

    /// <summary>ID'ye göre mock endpoint siler</summary>
    public async Task DeleteAsync(int id)
    {
        var endpoint = await _context.MockEndpoints.FindAsync(id);
        if (endpoint != null)
        {
            _context.MockEndpoints.Remove(endpoint);
            await _context.SaveChangesAsync();
        }
    }
}