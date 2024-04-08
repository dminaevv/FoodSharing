using Microsoft.AspNetCore.Mvc;

namespace FoodSharing.Site.Infrastructure;

public class BaseController : Controller
{
    protected SystemUser? OptionalSystemUser => HttpContext.Items.ContainsKey(CookieNames.SystemUser) ? HttpContext.Items[CookieNames.SystemUser] as SystemUser : null;
    protected SystemUser SystemUser => OptionalSystemUser!;

    public ViewResult ReactApp()
    {
        return View("ReactApp", new ReactApp("ReactApp", SystemUser, ));
    }

    protected void WriteCookie(String key, String value, DateTime expires, Boolean httpOnly, Boolean secure)
    {
        Response.Cookies.Append(
            key: key,
            value: value,
            options: new CookieOptions
            {
                Expires = expires,
            }
        );
    }

    protected String? ReadCookie(String key)
    {
        return Request.Cookies.ContainsKey(key) ? Request.Cookies[key] : null;
    }

    protected void DeleteCookie(String key)
    {
        Response.Cookies.Delete(key);
    }

}