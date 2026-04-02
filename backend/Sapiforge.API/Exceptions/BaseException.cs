namespace Sapiforge.API.Exceptions;

/// <summary>
/// Tüm özel exception sınıflarının türediği temel sınıf.
/// HTTP durum kodu ve hata mesajını bir arada tutar.
/// </summary>
public abstract class BaseException : Exception
{
    /// <summary>HTTP durum kodu — 400, 401, 404, 409 vb.</summary>
    public int StatusCode { get; }

    protected BaseException(string message, int statusCode) : base(message)
    {
        StatusCode = statusCode;
    }
}