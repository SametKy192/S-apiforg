namespace Sapiforge.Service;

using Sapiforge.Domain.Interfaces;
using Sapiforge.Domain.Models;

/// <summary>
/// Ortam değişkenleri yönetimi iş mantığını yönetir.
/// IEnvironmentService interface'ini implemente eder.
/// </summary>
public class EnvironmentService : IEnvironmentService
{
    private readonly IEnvironmentRepository _environmentRepository;

    /// <summary>Bağımlılık dependency injection ile enjekte edilir</summary>
    public EnvironmentService(IEnvironmentRepository environmentRepository)
    {
        _environmentRepository = environmentRepository;
    }

    /// <summary>Tüm ortamları getirir</summary>
    public async Task<IEnumerable<AppEnvironment>> GetAllAsync()
    {
        return await _environmentRepository.GetAllAsync();
    }

    /// <summary>Aktif ortamı getirir</summary>
    public async Task<AppEnvironment?> GetActiveAsync()
    {
        return await _environmentRepository.GetActiveAsync();
    }

    /// <summary>Yeni ortam oluşturur</summary>
    public async Task<AppEnvironment> CreateAsync(AppEnvironment environment)
    {
        return await _environmentRepository.AddAsync(environment);
    }

    /// <summary>
    /// Ortamı günceller.
    /// Eğer aktif olarak işaretlendiyse diğer tüm ortamları pasif yapar.
    /// </summary>
    public async Task<AppEnvironment> UpdateAsync(AppEnvironment environment)
    {
        return await _environmentRepository.UpdateAsync(environment);
    }

    /// <summary>Ortamı siler</summary>
    public async Task DeleteAsync(int id)
    {
        await _environmentRepository.DeleteAsync(id);
    }
}