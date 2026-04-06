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
    private readonly IEnvironmentService _environmentService;

    /// <summary>Bağımlılıklar dependency injection ile enjekte edilir</summary>
    public RequestService(
        IRequestRepository requestRepository,
        IProxyService proxyService,
        IEnvironmentService environmentService)
    {
        _requestRepository = requestRepository;
        _proxyService = proxyService;
        _environmentService = environmentService;
    }

    /// <summary>
    /// İsteği DB'ye kaydeder, proxy üzerinden dış API'ye iletir,
    /// response'u DB'ye kaydeder ve döndürür.
    /// Değişkenleri ({{var}}) aktif ortamdaki değerlerle değiştirir.
    /// </summary>
    public async Task<ApiResponse> SendRequestAsync(ApiRequest request)
    {
        // Aktif ortamı al ve değişkenleri yerleştir
        var activeEnv = await _environmentService.GetActiveAsync();
        if (activeEnv != null && !string.IsNullOrEmpty(activeEnv.Variables))
        {
            var variables = System.Text.Json.JsonSerializer
                .Deserialize<Dictionary<string, string>>(activeEnv.Variables);

            if (variables != null)
            {
                foreach (var variable in variables)
                {
                    var placeholder = "{{" + variable.Key + "}}";
                    request.Url = request.Url.Replace(placeholder, variable.Value);
                    
                    if (!string.IsNullOrEmpty(request.Headers))
                        request.Headers = request.Headers.Replace(placeholder, variable.Value);
                    
                    if (!string.IsNullOrEmpty(request.Body))
                        request.Body = request.Body.Replace(placeholder, variable.Value);
                }
            }
        }

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