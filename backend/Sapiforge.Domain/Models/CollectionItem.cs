namespace Sapiforge.Domain.Models;

/// <summary>
/// Bir koleksiyona ait tekil istek kaydını temsil eder.
/// Collection ile ApiRequest arasındaki çoka-çok ilişkiyi yönetir.
/// </summary>
public class CollectionItem
{
    /// <summary>Benzersiz kayıt kimliği</summary>
    public int Id { get; set; }

    /// <summary>Bu öğenin ait olduğu koleksiyonun kimliği (foreign key)</summary>
    public int CollectionId { get; set; }

    /// <summary>Bu öğenin temsil ettiği isteğin kimliği (foreign key)</summary>
    public int ApiRequestId { get; set; }

    /// <summary>Koleksiyon içindeki sıralama — küçük değer önce gelir</summary>
    public int Order { get; set; } = 0;

    /// <summary>İlişkili koleksiyon nesnesi — navigation property</summary>
    public Collection Collection { get; set; } = null!;

    /// <summary>İlişkili istek nesnesi — navigation property</summary>
    public ApiRequest Request { get; set; } = null!;
}