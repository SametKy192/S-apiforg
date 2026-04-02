namespace Sapiforge.API.Exceptions;

/// <summary>
/// Gelen istek verisi geçersiz veya eksik olduğunda fırlatılır.
/// HTTP 400 Bad Request döndürür.
/// </summary>
public class ValidationException : BaseException
{
    public ValidationException(string message = "Geçersiz istek verisi.")
        : base(message, 400) { }
}