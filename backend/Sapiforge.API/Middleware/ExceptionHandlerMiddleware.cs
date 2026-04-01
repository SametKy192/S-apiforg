namespace Sapiforge.API.Middleware;

using System.Net;
using System.Text.Json;

/// <summary>
/// Global hata yönetimi middleware'i.
/// Uygulama genelinde yakalanmayan hataları yakalar,
/// kullanıcıya anlamlı bir hata mesajı döndürür.
/// </summary>
public class ExceptionHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlerMiddleware> _logger;

    public ExceptionHandlerMiddleware(RequestDelegate next, ILogger<ExceptionHandlerMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            // Hatayı logla
            _logger.LogError(ex, "Beklenmeyen bir hata oluştu: {Message}", ex.Message);

            // Kullanıcıya hata döndür
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        // Hata tipine göre status kodu belirle
        context.Response.StatusCode = exception switch
        {
            ArgumentNullException => (int)HttpStatusCode.BadRequest,
            ArgumentException => (int)HttpStatusCode.BadRequest,
            KeyNotFoundException => (int)HttpStatusCode.NotFound,
            UnauthorizedAccessException => (int)HttpStatusCode.Unauthorized,
            _ => (int)HttpStatusCode.InternalServerError
        };

        // Hata response'u oluştur
        var errorResponse = new
        {
            statusCode = context.Response.StatusCode,
            message = exception switch
            {
                ArgumentNullException => "Geçersiz istek — zorunlu alan eksik.",
                ArgumentException => "Geçersiz istek — hatalı parametre.",
                KeyNotFoundException => "İstenen kayıt bulunamadı.",
                UnauthorizedAccessException => "Bu işlem için yetkiniz yok.",
                _ => "Sunucuda beklenmeyen bir hata oluştu."
            },
            detail = exception.Message
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(errorResponse));
    }
}