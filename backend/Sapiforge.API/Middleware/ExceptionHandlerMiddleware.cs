namespace Sapiforge.API.Middleware;

using System.Text.Json;
using Sapiforge.API.Exceptions;
using Sapiforge.API.Models;

/// <summary>
/// Global hata yönetimi middleware'i.
/// Tüm exception türlerini yakalar, uygun HTTP kodu ile standart
/// ErrorResponse formatında döndürür. Uygulama hiç çökmez.
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
            _logger.LogError(ex, "Hata oluştu: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        // Exception türüne göre HTTP kodu ve mesaj belirle
        var errorResponse = exception switch
        {
            // Özel exception'larımız — doğrudan kodu ve mesajı al
            BaseException baseEx => new ErrorResponse
            {
                StatusCode = baseEx.StatusCode,
                Message = baseEx.Message
            },

            // .NET built-in exception'lar — uygun koda çevir
            ArgumentException => new ErrorResponse
            {
                StatusCode = 400,
                Message = exception.Message
            },
            KeyNotFoundException => new ErrorResponse
            {
                StatusCode = 404,
                Message = exception.Message
            },
            UnauthorizedAccessException => new ErrorResponse
            {
                StatusCode = 401,
                Message = "Bu işlem için giriş yapmanız gerekiyor."
            },
            // Hedef sunucuya bağlanılamadığında
            System.Net.Http.HttpRequestException => new ErrorResponse
            {
                 StatusCode = 503,
                Message = "Hedef sunucuya bağlanılamadı. Sunucu çalışmıyor olabilir."
            },
            // Bilinmeyen hatalar — 500 döner, detay loglanır
            _ => new ErrorResponse
            {
                StatusCode = 500,
                Message = "Sunucuda beklenmedik bir hata oluştu."
            }
        };

        context.Response.StatusCode = errorResponse.StatusCode;

        await context.Response.WriteAsync(
            JsonSerializer.Serialize(errorResponse,
                new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }));
    }
}