namespace Sapiforge.API.Exceptions;

/// <summary>
/// İstenen kayıt veritabanında bulunamadığında fırlatılır.
/// HTTP 404 Not Found döndürür.
/// </summary>
public class NotFoundException : BaseException
{
    public NotFoundException(string message = "İstenen kayıt bulunamadı.")
        : base(message, 404) { }
}