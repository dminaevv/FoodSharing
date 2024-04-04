using Microsoft.AspNetCore.Diagnostics;
using System.Net;
namespace Typography.Startup;

public static class ExceptionHandler
{
    public static void UseExceptionsHandler(this IApplicationBuilder app)
    {
        app.UseExceptionHandler(builder =>
        {
            builder.Run(async context =>
            {
                Exception? exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;

                
                context.Response.Clear();
                context.Response.StatusCode = (Int32)HttpStatusCode.InternalServerError;
                context.Response.ContentType = "application/json";
            });
        });
    }
}