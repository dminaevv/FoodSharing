namespace FoodSharing.Site.Tools.Extensions;

public static class HttpRequestExtension
{
    public static Boolean IsAjaxRequest(this HttpRequest request)
    {
        if (request == null)
            throw new ArgumentNullException(nameof(request));

        if (request.Headers != null)
            return request.Headers["X-Requested-With"] == "XMLHttpRequest";

        return false;
    }
}
