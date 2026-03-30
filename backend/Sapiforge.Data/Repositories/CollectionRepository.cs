namespace Sapiforge.Data.Repositories;

using Microsoft.EntityFrameworkCore;
using Sapiforge.Domain.Interfaces;
using Sapiforge.Domain.Models;

/// <summary>
/// Koleksiyon yönetimi için veritabanı işlemlerini yönetir.
/// ICollectionRepository interface'ini implemente eder.
/// </summary>
public class CollectionRepository : ICollectionRepository
{
    private readonly AppDbContext _context;

    /// <summary>DbContext dependency injection ile enjekte edilir</summary>
    public CollectionRepository(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>Tüm koleksiyonları getirir</summary>
    public async Task<IEnumerable<Collection>> GetAllAsync()
    {
        return await _context.Collections
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    /// <summary>ID'ye göre koleksiyonu içindeki isteklerle birlikte getirir</summary>
    public async Task<Collection?> GetByIdWithItemsAsync(int id)
    {
        return await _context.Collections
            .Include(c => c.Items)
                .ThenInclude(i => i.Request)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    /// <summary>Yeni koleksiyon oluşturur</summary>
    public async Task<Collection> AddAsync(Collection collection)
    {
        _context.Collections.Add(collection);
        await _context.SaveChangesAsync();
        return collection;
    }

    /// <summary>Koleksiyona yeni istek ekler</summary>
    public async Task AddItemAsync(CollectionItem item)
    {
        _context.CollectionItems.Add(item);
        await _context.SaveChangesAsync();
    }

    /// <summary>Koleksiyonu ve içindeki tüm öğeleri siler</summary>
    public async Task DeleteAsync(int id)
    {
        var collection = await _context.Collections.FindAsync(id);
        if (collection != null)
        {
            _context.Collections.Remove(collection);
            await _context.SaveChangesAsync();
        }
    }
}