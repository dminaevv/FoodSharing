using FoodSharing.Site.Infrastructure;
using FoodSharing.Site.Services.Users;
using Microsoft.AspNetCore.Mvc;

namespace FoodSharing.Site.Controllers.Account;

public class ProfileController : BaseController
{
    private readonly IUsersService _usersService;

    public ProfileController(IUsersService usersService)
    {
        _usersService = usersService;
    }

    [HttpGet("profile")]
    public IActionResult Index()
    {
        return ReactApp();
    }
}