using FoodSharing.Site.Models.Users;
using FoodSharing.Site.Services.Users;
using FoodSharing.Site.Tools.Extensions;
using Microsoft.AspNetCore.Authorization;
using System.Net;

namespace FoodSharing.Site.Infrastructure;

internal class SiteMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IUsersService _usersService;

    public SiteMiddleware(RequestDelegate next, IUsersService usersService)
    {
        _next = next;
        _usersService = usersService;
    }


    public async Task Invoke(HttpContext context)
    {
        try
        {
            SystemUser? systemUser = GetSystemUser(context);
            context.Items[CookieNames.SystemUser] = systemUser;

            Boolean isAllowAnonymousMethod = context.EndpointHasAttribute<AllowAnonymousAttribute>();
            if (isAllowAnonymousMethod)
            {
                await _next.Invoke(context);
                return;
            };

            if (systemUser is null)
                throw new UnauthenticatedException();

            await _next.Invoke(context);
        }
        catch (Exception exception)
        {
            if (exception is UnauthenticatedException)
                SetUnauthenticated(context);

            else throw;
        }
    }

    private SystemUser? GetSystemUser(
        HttpContext context
    )
    {
        IRequestCookieCollection cookies = context.Request.Cookies;
        if (!cookies.ContainsKey(CookieNames.SystemUserToken)) return null;

        String? token = cookies[CookieNames.SystemUserToken];
        if (token is null) return null;

        User? user = _usersService.GetUserByToken(token);
        if (user is null) return null;

        return new SystemUser(user);
    }

    private void SetUnauthenticated(HttpContext context)
    {
        if (context.Request.IsAjaxRequest())
        {
            ClearAjaxRequest(context);
        }
        else
        {
            context.Response.Cookies.Delete(CookieNames.SystemUserToken);
            context.Response.Redirect("/login");
        }
    }

    private void ClearAjaxRequest(HttpContext context)
    {
        context.Response.Clear();
        context.Response.StatusCode = (Int32)HttpStatusCode.Forbidden;
    }

    private class UnauthenticatedException : Exception { }
}