using FoodSharing.Site.Infrastructure;
using FoodSharing.Site.Services;
using Microsoft.AspNetCore.Http.Features;
using System.Text.Json;
using FoodSharing.Site;
using FoodSharing.Site.Hubs;
using static System.Int32;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.Initialize(builder.Environment.EnvironmentName);
builder.Services.Configure<FormOptions>(options =>
{
    options.ValueLengthLimit = MaxValue;
    options.BufferBodyLengthLimit = MaxValue;
    options.KeyLengthLimit = MaxValue;
    options.MultipartBodyLengthLimit = Int64.MaxValue;
});
builder.Services.AddControllersWithViews().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});

builder.Services.AddSignalR();
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
app.UseRouting();
//app.UseCors(options =>
//{
//    options.AllowAnyOrigin()
//        .AllowAnyMethod()
//        .AllowAnyHeader();
//});
app.MapHub<ChatHub>("/chat");
app.UseMiddleware<SiteMiddleware>();
app.UseEndpoints(endpoints => endpoints.MapDefaultControllerRoute());
app.Run();
