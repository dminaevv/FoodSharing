using FoodSharing.Site.Infrastructure;
using FoodSharing.Site.Models.Chats;
using FoodSharing.Site.Services.Chat;
using Microsoft.AspNetCore.Mvc;

namespace FoodSharing.Site.Controllers.Chat;

public class ChatController: BaseController
{
    private readonly IChatService _chatService;

    public ChatController(IChatService chatService)
    {
        _chatService = chatService;
    }

    [HttpGet("chats")]
    [HttpGet("chat/{userId}")]
    public IActionResult Index()
    {
        return ReactApp();
    }

    [HttpGet("chat/getByAnnouncementId")]
    public Object Get([FromQuery] Guid announcementId)
    {
        var result =  _chatService.GetChatByAnnouncementId(announcementId, SystemUser.Id);

        return new
        {
            chat = result.chat,
            messages = result.messages
        };
    }
}