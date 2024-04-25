using FoodSharing.Site.Infrastructure;
using FoodSharing.Site.Models.Announcements;
using FoodSharing.Site.Models.Chats;
using FoodSharing.Site.Models.Users;
using FoodSharing.Site.Services.Chat;
using Microsoft.AspNetCore.Mvc;

namespace FoodSharing.Site.Controllers.Chat;

public class ChatController : BaseController
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
    public Object Get([FromQuery] Guid chatId)
    {
        (Models.Chats.Chat? chat, Message[] messages, User[] members) = _chatService.GetChat(chatId, SystemUser.User);

        return new
        {
            chat = chat,
            messages = messages,
            members = members
        };
    }


    [HttpGet("chat/getByAnnouncementId")]
    public Object GetByAnnouncement([FromQuery] Guid announcementId)
    {
        (Models.Chats.Chat? chat, Message[] messages, User[] members) = _chatService.GetChatByAnnouncementId(announcementId, SystemUser.User);

        return new
        {
            chat = chat,
            messages = messages,
            members = members
        };
    }

    [HttpGet("chat/get-list")]
    public Object GetList()
    {
        (Models.Chats.Chat[] chats, Message[] messages, User[] members, Announcement[] announcements) = _chatService.GetChats(SystemUser.Id);

        return new
        {
            chats = chats,
            messages = messages,
            members = members,
            announcements = announcements
        };
    }
}