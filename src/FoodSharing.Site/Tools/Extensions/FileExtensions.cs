
namespace FoodSharing.Site.Tools.Extensions;

public static class FileExtensions
{
    public static Byte[] ToBytes(this IFormFile file)
    {
        using var memoryStream = new MemoryStream();
        file.CopyTo(memoryStream);

        return memoryStream.ToArray();
    }
}