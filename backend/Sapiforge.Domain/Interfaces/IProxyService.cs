namespace Sapiforge.Domain.Interfaces;

using Sapiforge.Domain.Models;

/// <summary>
/// Dış API'ye istek iletme (proxy) işlemi için servis sözleşmesi.
/// Service katmanındaki ProxyService bu interface'i implemente eder.
/// Proxy engine'in kalbidir — gelen isteği alır, dış API'ye iletir, response döner.
/// </summary>
public interface IProxyService
{
    /// <summary>
    /// Verilen ApiRequest'i dış API'ye iletir ve ApiResponse olarak döndürür.
    /// Header, body, method bilgilerini olduğu gibi iletir.
    /// Süre ve boyut bilgilerini otomatik hesaplar.
    /// </summary>
    Task<ApiResponse> ForwardAsync(ApiRequest request);
}