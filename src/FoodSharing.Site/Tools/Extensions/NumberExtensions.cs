namespace FoodSharing.Site.Tools.Extensions;

public static class NumberExtensions
{
    public static Int32 ButNotLess(this Int32 value, Int32 minValue)
    {
        return Math.Max(value, minValue);
    }

    public static Int32 ButNotMore(this Int32 value, Int32 maxValue)
    {
        return Math.Min(value, maxValue);
    }
}
