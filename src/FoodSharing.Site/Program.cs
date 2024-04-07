using FoodSharing.Site.Infrastructure;
using FoodSharing.Site.Services;
using Microsoft.AspNetCore.Http.Features;
using System.Text.Json;
using Typography.Startup;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.Initialize(builder.Environment.EnvironmentName);
builder.Services.Configure<FormOptions>(options =>
{
    options.ValueLengthLimit = Int32.MaxValue;
    options.BufferBodyLengthLimit = Int32.MaxValue;
    options.KeyLengthLimit = Int32.MaxValue;
    options.MultipartBodyLengthLimit = Int64.MaxValue;
});
builder.Services.AddControllersWithViews().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});

builder.Services.AddResponseCompression();

WebApplication app = builder.Build();
app.Use((context, next) =>
{
    context.Request.EnableBuffering();
    return next();
});
app.UseExceptionsHandler();
app.UseStatusCodePagesWithRedirects("/Error/{0}");
app.UseStaticFiles();
app.UseResponseCompression();
app.UseCors();
app.UseRouting();
app.UseMiddleware<SiteMiddleware>();
app.UseEndpoints(endpoints => endpoints.MapDefaultControllerRoute());
app.Run();
