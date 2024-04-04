using System.Diagnostics.CodeAnalysis;
using System.Runtime.CompilerServices;

namespace FoodSharing.Site.Tools.Extensions;

public static class NullableExtensions
{
    public static T NotNullOrThrow<T>([NotNull] this T? value, [CallerArgumentExpression("value")] String name = "")
    where T : class =>
    value ?? throw new NullReferenceException(name + " is null");

    public static T NotNullOrThrow<T>([NotNull] this T? value, [CallerArgumentExpression("value")] String name = "")
        where T : struct =>
        value ?? throw new ArgumentNullException(name + " is null");

}
