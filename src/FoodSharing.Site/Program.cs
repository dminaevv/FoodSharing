using FoodSharing.Site;
using FoodSharing.Site.Hubs;
using FoodSharing.Site.Infrastructure;
using FoodSharing.Site.Services;
using Microsoft.AspNetCore.Http.Features;
using System.Text.Json;
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

builder.Services.AddSwaggerGen();


WebApplication app = builder.Build();
app.Use((context, next) =>
{
    context.Request.EnableBuffering();
    return next();
});
app.UseExceptionsHandler();
app.UseStaticFiles();
app.UseResponseCompression();
app.UseRouting();
app.UseCors(options =>
{
    options.AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
        .WithOrigins("https://foodsharing.virtuumlab.ru");
});
app.MapHub<ChatHub>("/chat");
app.UseMiddleware<SiteMiddleware>();

app.UseSwagger();
app.UseSwaggerUI();

app.UseEndpoints(endpoints => endpoints.MapDefaultControllerRoute());
app.Run();
