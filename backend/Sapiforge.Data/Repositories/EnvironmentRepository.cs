namespace Sapiforge.Data.Repositories;

using Microsoft.EntityFrameworkCore;
using Sapiforge.Domain.Interfaces;
using Sapiforge.Domain.Models;

/// <summary>
/// Ortam değişkenleri yönetimi için veritabanı işlemlerini yönetir.
/// IEnvironmentRepository interface'ini implemente eder.
/// </summary>
public class EnvironmentRepository : IEnvironmentRepository
{
    private readonly AppDbContext _context;

    /// <summary>DbContext dependency injection ile enjekte edilir</summary>
    public EnvironmentRepository(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>Tüm ortamları getirir</summary>
    public async Task<IEnumerable<AppEnvironment>> GetAllAsync()
    {
        return await _context.Environments
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync();
    }

    /// <summary>Aktif ortamı getirir — sadece bir ortam aktif olabilir</summary>
    public async Task<AppEnvironment?> GetActiveAsync()
    {
        return await _context.Environments
            .FirstOrDefaultAsync(e => e.IsActive);
    }

    /// <summary>Yeni ortam oluşturur</summary>
    public async Task<AppEnvironment> AddAsync(AppEnvironment environment)
    {
        // Eğer yeni ortam aktif gelirse, diğerlerini temizle
        if (environment.IsActive)
        {
            await _context.Environments
                .Where(e => e.IsActive)
                .ExecuteUpdateAsync(s => s.SetProperty(p => p.IsActive, false));
        }

        _context.Environments.Add(environment);
        await _context.SaveChangesAsync();
        return environment;
    }

    public async Task<AppEnvironment> UpdateAsync(AppEnvironment environment)
    {
        // Eğer bu ortam AKTİF olarak gelmişse, veritabanındaki her şeyi sıfırlıyoruz.
        if (environment.IsActive)
        {
            await _context.Environments
                .ExecuteUpdateAsync(s => s.SetProperty(p => p.IsActive, false));
        }

        // Nesnemizi güncelliyoruz. (Eğer IsActive=true ise şimdi veritabanında tek aktif bu olacak)
        _context.Entry(environment).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        
        return environment;
    }

    /// <summary>Ortamı siler</summary>
    public async Task DeleteAsync(int id)
    {
        var environment = await _context.Environments.FindAsync(id);
        if (environment != null)
        {
            _context.Environments.Remove(environment);
            await _context.SaveChangesAsync();
        }
    }
}