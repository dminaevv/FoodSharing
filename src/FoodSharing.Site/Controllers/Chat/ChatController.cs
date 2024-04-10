using FoodSharing.Site.Infrastructure;
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

    [HttpGet("chat/get")]
    public Models.Chats.Chat? Get([FromQuery] Guid chatId)
    {
        return _chatService.GetChat(chatId);
    }
}