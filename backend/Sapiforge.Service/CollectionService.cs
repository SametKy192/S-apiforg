namespace Sapiforge.Service;

using Sapiforge.Domain.Interfaces;
using Sapiforge.Domain.Models;

/// <summary>
/// Koleksiyon yönetimi iş mantığını yönetir.
/// ICollectionService interface'ini implemente eder.
/// </summary>
public class CollectionService : ICollectionService
{
    private readonly ICollectionRepository _collectionRepository;

    /// <summary>Bağımlılık dependency injection ile enjekte edilir</summary>
    public CollectionService(ICollectionRepository collectionRepository)
    {
        _collectionRepository = collectionRepository;
    }

    /// <summary>Tüm koleksiyonları getirir</summary>
    public async Task<IEnumerable<Collection>> GetAllAsync()
    {
        return await _collectionRepository.GetAllAsync();
    }

    /// <summary>ID'ye göre koleksiyonu içindeki isteklerle birlikte getirir</summary>
    public async Task<Collection?> GetByIdAsync(int id)
    {
        return await _collectionRepository.GetByIdWithItemsAsync(id);
    }

    /// <summary>Yeni koleksiyon oluşturur</summary>
    public async Task<Collection> CreateAsync(Collection collection)
    {
        return await _collectionRepository.AddAsync(collection);
    }

    /// <summary>
    /// Koleksiyona yeni istek ekler.
    /// Sıralama otomatik olarak sonraki değere atanır.
    /// </summary>
    public async Task AddItemAsync(int collectionId, int requestId)
    {
        var item = new CollectionItem
        {
            CollectionId = collectionId,
            ApiRequestId = requestId
        };
        await _collectionRepository.AddItemAsync(item);
    }

    /// <summary>Koleksiyonu ve içindeki tüm öğeleri siler</summary>
    public async Task DeleteAsync(int id)
    {
        await _collectionRepository.DeleteAsync(id);
    }
}