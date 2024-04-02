namespace FoodSharing.Site.Tools.Types;

public struct Error
{
    public String Message { get; }

    public Error(String message)
    {
        Message = message;
    }
}

public static class ErrorExtensions
{
    public static String AsString(this IEnumerable<Error> errors) => String.Join("; ", errors.Select(e => e.Message));
}