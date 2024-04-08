using FoodSharing.Site.Infrastructure;
using FoodSharing.Site.Models.Users;
using FoodSharing.Site.Services.Users;
using FoodSharing.Site.Tools.Types;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodSharing.Site.Controllers.Auth;

public class AuthController : BaseController
{
    private readonly IUsersService _usersService;

    public AuthController(IUsersService usersService)
    {
        _usersService = usersService;
    }

    [AllowAnonymous]
    [HttpGet("login")]
    public IActionResult Login()
    {
        if (OptionalSystemUser is not null) return Redirect("/");

        return ReactApp();
    }

    [AllowAnonymous]
    [HttpGet("register")]
    public IActionResult Register()
    {
        if (OptionalSystemUser is not null) return Redirect("/");

        return ReactApp();
    }

    public record LoginRequest(String Email, String Password);

    [AllowAnonymous]
    [HttpPost("login")]
    public ActionResult Login([FromBody] LoginRequest request)
    {
        DataResult<UserToken> logInResult = _usersService.Authenticate(request.Email, request.Password);
        if (!logInResult.IsSuccess) return Json(Result.Fail(logInResult.Errors));

        WriteCookie(CookieNames.SystemUserToken, logInResult.Data.Token, expires: DateTime.MaxValue, httpOnly: true, secure: true);

        return Redirect("/");
    }

    [HttpGet("logout")]
    public async Task<IActionResult> LogOut()
    {
        String? token = ReadCookie(CookieNames.SystemUserToken);
        if (String.IsNullOrWhiteSpace(token)) return Redirect("/");

        _usersService.LogOut(token);
        DeleteCookie(CookieNames.SystemUserToken);

        return Redirect("/");
    }

    public record RegisterRequest(String? Email, String? Password);

    [AllowAnonymous]
    [HttpPost("register")]
    public Result RegisterUser([FromBody] RegisterRequest request)
    {
        Result registerUserResult = _usersService.RegisterUser(request.Email, request.Password);
        if (!registerUserResult.IsSuccess) return Result.Fail(registerUserResult.Errors);

        return Result.Success();
    }
}