namespace FoodSharing.Site.Tools.Extensions;

public class Enum<T> where T : Enum
{
    public static T[] AllCases => Enum.GetValues(typeof(T)).Cast<T>().ToArray();

}