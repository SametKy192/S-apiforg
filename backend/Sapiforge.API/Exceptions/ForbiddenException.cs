namespace Sapiforge.API.Exceptions;

/// <summary>
/// Kullanıcı kimliği doğrulanmış ama bu işlem için yetkisi olmadığında fırlatılır.
/// HTTP 403 Forbidden döndürür.
/// </summary>
public class ForbiddenException : BaseException
{
    public ForbiddenException(string message = "Bu işlem için yetkiniz bulunmuyor.")
        : base(message, 403) { }
}