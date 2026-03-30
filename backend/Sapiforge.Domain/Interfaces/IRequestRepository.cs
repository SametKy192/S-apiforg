namespace Sapiforge.Domain.Interfaces;

using Sapiforge.Domain.Models;

/// <summary>
/// API istek geçmişi için veri erişim sözleşmesi.
/// Data katmanındaki RequestRepository bu interface'i implemente eder.
/// </summary>
public interface IRequestRepository
{
    /// <summary>Tüm istek geçmişini getirir</summary>
    Task<IEnumerable<ApiRequest>> GetAllAsync();

    /// <summary>ID'ye göre tek bir isteği getirir</summary>
    Task<ApiRequest?> GetByIdAsync(int id);

    /// <summary>Yeni istek kaydeder</summary>
    Task<ApiRequest> AddAsync(ApiRequest request);

    /// <summary>ID'ye göre isteği siler</summary>
    Task DeleteAsync(int id);
}