using Microsoft.AspNetCore.Mvc.Controllers;

namespace FoodSharing.Site.Tools.Extensions;

public static class HttpContextExtensions
{
    public static Boolean EndpointHasAttribute<T>(this HttpContext context) where T : Attribute
    {
        Boolean? isEndpointHasAttribute = context.GetEndpoint()
            ?.Metadata
            .GetMetadata<ControllerActionDescriptor>()
            ?.MethodInfo
            .GetCustomAttributes(inherit: true)
            .OfType<T>()
            .Any();

        return isEndpointHasAttribute ?? false;
    }


    public static T[] GetAttributes<T>(this HttpContext context) where T : Attribute
    {
        return context.GetEndpoint()
            ?.Metadata
            .GetMetadata<ControllerActionDescriptor>()
            ?.MethodInfo
            .GetCustomAttributes(inherit: true)
            .OfType<T>()
            .ToArray() ?? new T[0];
    }
}
