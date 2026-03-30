namespace Sapiforge.Domain.Interfaces;

using Sapiforge.Domain.Models;

/// <summary>
/// Mock endpoint yönetimi için veri erişim sözleşmesi.
/// Data katmanındaki MockRepository bu interface'i implemente eder.
/// </summary>
public interface IMockRepository
{
    /// <summary>Tüm mock endpoint'leri getirir</summary>
    Task<IEnumerable<MockEndpoint>> GetAllAsync();

    /// <summary>ID'ye göre tek bir mock endpoint getirir</summary>
    Task<MockEndpoint?> GetByIdAsync(int id);

    /// <summary>Path ve method'a göre mock endpoint arar — istek eşleştirmede kullanılır</summary>
    Task<MockEndpoint?> GetByPathAndMethodAsync(string path, string method);

    /// <summary>Yeni mock endpoint kaydeder</summary>
    Task<MockEndpoint> AddAsync(MockEndpoint endpoint);

    /// <summary>Mevcut mock endpoint'i günceller</summary>
    Task<MockEndpoint> UpdateAsync(MockEndpoint endpoint);

    /// <summary>ID'ye göre mock endpoint siler</summary>
    Task DeleteAsync(int id);
}