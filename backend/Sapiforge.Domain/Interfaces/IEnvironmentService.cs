namespace Sapiforge.Domain.Interfaces;

using Sapiforge.Domain.Models;

/// <summary>
/// Ortam değişkenleri yönetimi için servis sözleşmesi.
/// Service katmanındaki EnvironmentService bu interface'i implemente eder.
/// </summary>
public interface IEnvironmentService
{
    /// <summary>Tüm ortamları getirir</summary>
    Task<IEnumerable<AppEnvironment>> GetAllAsync();

    /// <summary>Aktif ortamı getirir</summary>
    Task<AppEnvironment?> GetActiveAsync();

    /// <summary>Yeni ortam oluşturur</summary>
    Task<AppEnvironment> CreateAsync(AppEnvironment environment);

    /// <summary>Ortamı günceller</summary>
    Task<AppEnvironment> UpdateAsync(AppEnvironment environment);

    /// <summary>Ortamı siler</summary>
    Task DeleteAsync(int id);
}