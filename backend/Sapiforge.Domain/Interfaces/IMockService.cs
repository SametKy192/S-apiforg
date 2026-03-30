namespace Sapiforge.Domain.Interfaces;

using Sapiforge.Domain.Models;

/// <summary>
/// Mock endpoint yönetimi için servis sözleşmesi.
/// Service katmanındaki MockService bu interface'i implemente eder.
/// </summary>
public interface IMockService
{
    /// <summary>Tüm mock endpoint'leri getirir</summary>
    Task<IEnumerable<MockEndpoint>> GetAllAsync();

    /// <summary>ID'ye göre tek bir mock endpoint getirir</summary>
    Task<MockEndpoint?> GetByIdAsync(int id);

    /// <summary>
    /// Gelen isteğin path ve method'una göre eşleşen mock endpoint'i bulur.
    /// Mock engine bu metod üzerinden çalışır.
    /// </summary>
    Task<MockEndpoint?> MatchAsync(string path, string method);

    /// <summary>Yeni mock endpoint oluşturur</summary>
    Task<MockEndpoint> CreateAsync(MockEndpoint endpoint);

    /// <summary>Mevcut mock endpoint'i günceller</summary>
    Task<MockEndpoint> UpdateAsync(MockEndpoint endpoint);

    /// <summary>Mock endpoint siler</summary>
    Task DeleteAsync(int id);
}