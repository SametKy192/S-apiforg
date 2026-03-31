namespace Sapiforge.Service;

using Sapiforge.Domain.Interfaces;
using Sapiforge.Domain.Models;

/// <summary>
/// API isteği gönderme ve geçmiş yönetimi iş mantığını yönetir.
/// IRequestService interface'ini implemente eder.
/// ProxyService ile RequestRepository arasında köprü kurar.
/// </summary>
public class RequestService : IRequestService
{
    private readonly IRequestRepository _requestRepository;
    private readonly IProxyService _proxyService;

    /// <summary>Bağımlılıklar dependency injection ile enjekte edilir</summary>
    public RequestService(
        IRequestRepository requestRepository,
        IProxyService proxyService)
    {
        _requestRepository = requestRepository;
        _proxyService = proxyService;
    }

    /// <summary>
    /// İsteği DB'ye kaydeder, proxy üzerinden dış API'ye iletir,
    /// response'u DB'ye kaydeder ve döndürür.
    /// </summary>
    public async Task<ApiResponse> SendRequestAsync(ApiRequest request)
    {
        // İsteği önce DB'ye kaydet
        var savedRequest = await _requestRepository.AddAsync(request);

        // Proxy üzerinden dış API'ye ilet
        var response = await _proxyService.ForwardAsync(savedRequest);

        // Response'u DB'ye kaydet
        response.ApiRequestId = savedRequest.Id;
        await _requestRepository.SaveResponseAsync(response);

        return response;
    }

    /// <summary>Tüm istek geçmişini getirir</summary>
    public async Task<IEnumerable<ApiRequest>> GetHistoryAsync()
    {
        return await _requestRepository.GetAllAsync();
    }

    /// <summary>ID'ye göre tek bir isteği getirir</summary>
    public async Task<ApiRequest?> GetByIdAsync(int id)
    {
        return await _requestRepository.GetByIdAsync(id);
    }

    /// <summary>Geçmiş kaydını siler</summary>
    public async Task DeleteFromHistoryAsync(int id)
    {
        await _requestRepository.DeleteAsync(id);
    }
}