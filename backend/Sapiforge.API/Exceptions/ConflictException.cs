namespace Sapiforge.API.Exceptions;

/// <summary>
/// Kayıt zaten mevcut olduğunda veya çakışma olduğunda fırlatılır.
/// Örneğin aynı email ile kayıt olmaya çalışmak.
/// HTTP 409 Conflict döndürür.
/// </summary>
public class ConflictException : BaseException
{
    public ConflictException(string message = "Bu kayıt zaten mevcut.")
        : base(message, 409) { }
}