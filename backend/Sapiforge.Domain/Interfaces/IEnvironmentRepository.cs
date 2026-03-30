namespace Sapiforge.Domain.Interfaces;

using Sapiforge.Domain.Models;

/// <summary>
/// Ortam değişkenleri yönetimi için veri erişim sözleşmesi.
/// Data katmanındaki EnvironmentRepository bu interface'i implemente eder.
/// </summary>
public interface IEnvironmentRepository
{
    /// <summary>Tüm ortamları getirir</summary>
    Task<IEnumerable<AppEnvironment>> GetAllAsync();

    /// <summary>Aktif ortamı getirir — sadece bir ortam aktif olabilir</summary>
    Task<AppEnvironment?> GetActiveAsync();

    /// <summary>Yeni ortam oluşturur</summary>
    Task<AppEnvironment> AddAsync(AppEnvironment environment);

    /// <summary>Ortamı günceller</summary>
    Task<AppEnvironment> UpdateAsync(AppEnvironment environment);

    /// <summary>ID'ye göre ortamı siler</summary>
    Task DeleteAsync(int id);
}