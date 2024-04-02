using FoodSharing.Site.Infrastructure;
using FoodSharing.Site.Models.Users;
using FoodSharing.Site.Services.Users;
using Microsoft.AspNetCore.Mvc;

namespace FoodSharing.Site.Controllers.Account;

public class UserController : BaseController
{
    private readonly IUsersService _usersService;

    public UserController(IUsersService usersService)
    {
        _usersService = usersService;
    }

    [HttpGet("/user/{id}")]
    public IActionResult Index()
    {
        return ReactApp();
    }

    [HttpGet("/user/get-info")]
    public UserInfo GetProfileInfo([FromQuery] Guid userId)
    {
        return _usersService.GetUserInfo(userId);
    }

}