namespace Sapiforge.Service;

using Sapiforge.Domain.Interfaces;
using Sapiforge.Domain.Models;

/// <summary>
/// Mock endpoint yönetimi iş mantığını yönetir.
/// IMockService interface'ini implemente eder.
/// </summary>
public class MockService : IMockService
{
    private readonly IMockRepository _mockRepository;

    /// <summary>Bağımlılık dependency injection ile enjekte edilir</summary>
    public MockService(IMockRepository mockRepository)
    {
        _mockRepository = mockRepository;
    }

    /// <summary>Tüm mock endpoint'leri getirir</summary>
    public async Task<IEnumerable<MockEndpoint>> GetAllAsync()
    {
        return await _mockRepository.GetAllAsync();
    }

    /// <summary>ID'ye göre tek bir mock endpoint getirir</summary>
    public async Task<MockEndpoint?> GetByIdAsync(int id)
    {
        return await _mockRepository.GetByIdAsync(id);
    }

    /// <summary>
    /// Gelen isteğin path ve method'una göre eşleşen mock endpoint'i bulur.
    /// Bulunamazsa null döner — controller 404 döndürür.
    /// </summary>
    public async Task<MockEndpoint?> MatchAsync(string path, string method)
    {
        return await _mockRepository.GetByPathAndMethodAsync(path, method);
    }

    /// <summary>Yeni mock endpoint oluşturur</summary>
    public async Task<MockEndpoint> CreateAsync(MockEndpoint endpoint)
    {
        return await _mockRepository.AddAsync(endpoint);
    }

    /// <summary>Mevcut mock endpoint'i günceller</summary>
    public async Task<MockEndpoint> UpdateAsync(MockEndpoint endpoint)
    {
        return await _mockRepository.UpdateAsync(endpoint);
    }

    /// <summary>Mock endpoint siler</summary>
    public async Task DeleteAsync(int id)
    {
        await _mockRepository.DeleteAsync(id);
    }
}