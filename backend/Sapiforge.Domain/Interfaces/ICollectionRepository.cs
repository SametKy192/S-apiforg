namespace Sapiforge.Domain.Interfaces;

using Sapiforge.Domain.Models;

/// <summary>
/// Koleksiyon yönetimi için veri erişim sözleşmesi.
/// Data katmanındaki CollectionRepository bu interface'i implemente eder.
/// </summary>
public interface ICollectionRepository
{
    /// <summary>Tüm koleksiyonları getirir</summary>
    Task<IEnumerable<Collection>> GetAllAsync();

    /// <summary>ID'ye göre koleksiyonu içindeki isteklerle birlikte getirir</summary>
    Task<Collection?> GetByIdWithItemsAsync(int id);

    /// <summary>Yeni koleksiyon oluşturur</summary>
    Task<Collection> AddAsync(Collection collection);

    /// <summary>Koleksiyona yeni istek ekler</summary>
    Task AddItemAsync(CollectionItem item);

    /// <summary>Koleksiyonu siler — içindeki tüm öğeler de silinir</summary>
    Task DeleteAsync(int id);
}