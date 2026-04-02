namespace Sapiforge.API.Exceptions;

/// <summary>
/// Kullanıcı kimlik doğrulaması yapılmadan korumalı bir kaynağa
/// erişmeye çalıştığında fırlatılır.
/// HTTP 401 Unauthorized döndürür.
/// </summary>
public class UnauthorizedException : BaseException
{
    public UnauthorizedException(string message = "Bu işlem için giriş yapmanız gerekiyor.")
        : base(message, 401) { }
}