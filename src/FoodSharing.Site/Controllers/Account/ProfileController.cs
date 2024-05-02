using FoodSharing.Site.Infrastructure;
using FoodSharing.Site.Models.Users;
using FoodSharing.Site.Services.Users;
using FoodSharing.Site.Tools.Types;
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
    [HttpGet("profile/chats")]
    [HttpGet("profile/announcements")]
    [HttpGet("profile/chat/{chatId}")]
    [HttpGet("profile/chat/announcement/{announcementId}")]
    [HttpGet("profile/feedbacks")]
    [HttpGet("profile/favorites")]
    [HttpGet("profile/settings")]
    public IActionResult Index()
    {
        return ReactApp();
    }

    [HttpPost("profile/settings/save")]
    public Result Save([FromForm] UserBlank blank)
    {
       return _usersService.SaveUser(blank, SystemUser.User.Id); 
    }
}