using System.Diagnostics.CodeAnalysis;

namespace FoodSharing.Site.Tools.Extensions;

public static class StringExtensions
{

    public static Boolean IsNullOrWhitespace([NotNullWhen(false)] this String? str)
    {
        return String.IsNullOrWhiteSpace(str);
    }

    public static Boolean IsNotNullOrWhitespace([NotNullWhen(true)] this String? str)
    {
        return !String.IsNullOrWhiteSpace(str);
    }
}