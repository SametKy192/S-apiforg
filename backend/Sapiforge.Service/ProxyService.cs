namespace Sapiforge.Service;

using System.Diagnostics;
using System.Text;
using Sapiforge.Domain.Interfaces;
using Sapiforge.Domain.Models;

/// <summary>
/// Dış API'ye istek iletme işlemini yönetir.
/// IProxyService interface'ini implemente eder.
/// Gelen isteği olduğu gibi hedefe iletir, response'u ölçüp döndürür.
/// </summary>
public class ProxyService : IProxyService
{
    private readonly HttpClient _httpClient;

    /// <summary>HttpClient dependency injection ile enjekte edilir</summary>
    public ProxyService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    /// <summary>
    /// Verilen ApiRequest'i dış API'ye iletir.
    /// Süreyi stopwatch ile ölçer, response boyutunu hesaplar.
    /// </summary>
    public async Task<ApiResponse> ForwardAsync(ApiRequest request)
    {
        // HTTP isteğini oluştur
        var httpRequest = new HttpRequestMessage(
            new HttpMethod(request.Method),
            request.Url
        );

        // Header'ları ekle
        if (!string.IsNullOrEmpty(request.Headers))
        {
            var headers = System.Text.Json.JsonSerializer
                .Deserialize<Dictionary<string, string>>(request.Headers);

            if (headers != null)
                foreach (var header in headers)
                    httpRequest.Headers.TryAddWithoutValidation(header.Key, header.Value);
        }

        // Body ekle — GET ve DELETE için body olmaz
        if (!string.IsNullOrEmpty(request.Body) &&
            request.Method != "GET" &&
            request.Method != "DELETE")
        {
            httpRequest.Content = new StringContent(
                request.Body,
                Encoding.UTF8,
                "application/json"
            );
        }

        // İsteği gönder ve süreyi ölç
        var stopwatch = Stopwatch.StartNew();
        var httpResponse = await _httpClient.SendAsync(httpRequest);
        stopwatch.Stop();

        // Response body'yi oku
        var responseBody = await httpResponse.Content.ReadAsStringAsync();

        // Response header'larını JSON'a çevir
        var responseHeaders = System.Text.Json.JsonSerializer.Serialize(
            httpResponse.Headers.ToDictionary(h => h.Key, h => string.Join(", ", h.Value))
        );

        return new ApiResponse
        {
            ApiRequestId = request.Id,
            StatusCode = (int)httpResponse.StatusCode,
            Body = responseBody,
            Headers = responseHeaders,
            DurationMs = stopwatch.ElapsedMilliseconds,
            SizeBytes = Encoding.UTF8.GetByteCount(responseBody)
        };
    }
}