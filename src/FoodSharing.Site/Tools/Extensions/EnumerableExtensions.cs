
namespace FoodSharing.Site.Tools.Extensions;

public static class EnumerableExtensions
{
    public static Boolean IsEmpty<T>(this IEnumerable<T> enumerable)
    {
        return !enumerable.Any();
    }

    public static Boolean IsNullOrEmpty<T>(this IEnumerable<T>? enumerable)
    {
        return enumerable is null || enumerable.IsEmpty();
    }
}