namespace Sapiforge.Domain.Interfaces;

using Sapiforge.Domain.Models;

/// <summary>
/// Koleksiyon yönetimi için servis sözleşmesi.
/// Service katmanındaki CollectionService bu interface'i implemente eder.
/// </summary>
public interface ICollectionService
{
    /// <summary>Tüm koleksiyonları getirir</summary>
    Task<IEnumerable<Collection>> GetAllAsync();

    /// <summary>ID'ye göre koleksiyonu içindeki isteklerle birlikte getirir</summary>
    Task<Collection?> GetByIdAsync(int id);

    /// <summary>Yeni koleksiyon oluşturur</summary>
    Task<Collection> CreateAsync(Collection collection);

    /// <summary>Koleksiyona yeni istek ekler</summary>
    Task AddItemAsync(int collectionId, int requestId);

    /// <summary>Koleksiyonu siler</summary>
    Task DeleteAsync(int id);
}