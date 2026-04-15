namespace Sapiforge.Domain.Interfaces;

using Sapiforge.Domain.Models;

/// <summary>
/// API isteği gönderme ve geçmiş yönetimi için servis sözleşmesi.
/// Service katmanındaki RequestService bu interface'i implemente eder.
/// </summary>
public interface IRequestService
{
    /// <summary>
    /// Dış API'ye istek gönderir, response'u kaydeder ve döndürür.
    /// Proxy engine bu metod üzerinden çalışır.
    /// </summary>
    Task<ApiResponse> SendRequestAsync(ApiRequest request);

    /// <summary>Tüm istek geçmişini getirir</summary>
    Task<IEnumerable<ApiRequest>> GetHistoryAsync();

    /// <summary>ID'ye göre tek bir isteği getirir</summary>
    Task<ApiRequest?> GetByIdAsync(int id);

    /// <summary>Geçmiş kaydını siler</summary>
    Task DeleteFromHistoryAsync(int id);

    /// <summary>İstatistik verilerini getirir</summary>
    Task<object> GetStatsAsync();
}