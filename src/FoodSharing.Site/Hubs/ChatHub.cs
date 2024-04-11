using FoodSharing.Site.Infrastructure;
using FoodSharing.Site.Models.Announcements;
using FoodSharing.Site.Models.Chats;
using FoodSharing.Site.Models.Users;
using FoodSharing.Site.Services.Announcements;
using FoodSharing.Site.Services.Chat;
using FoodSharing.Site.Services.Users;
using Microsoft.AspNetCore.SignalR;

namespace FoodSharing.Site.Hubs;

public class ChatHub: Hub
{
    private readonly IUsersService _usersService;
    private readonly IChatService _chatService;
    private readonly IAnnouncementService _announcementService;

    private ChatService.UserConnection[] _connections => _chatService.GetConnections();

    public ChatHub(IUsersService usersService, IChatService chatService, IAnnouncementService announcementService)
    {
        _usersService = usersService;
        _chatService = chatService;
        _announcementService = announcementService;
    }

    public record NewMessageRequest(Message Message, Guid AnnouncementId);
    public async Task SendMessage(NewMessageRequest request)
    {
        String senderConnectionId = Context.ConnectionId;

        Chat? existChat = _chatService.GetChat(request.Message.ChatId);
        if (existChat is null)
        {
           Announcement? announcement =  _announcementService.GetAnnouncement(request.AnnouncementId);
           if (announcement is null) throw new Exception("");

           User? user = _usersService.GetUser(announcement.OwnerUserId);
           if (user is null) throw new Exception("");

            Chat chat = Chat.Create(request.Message.ChatId, request.AnnouncementId, user.Id, request.Message.CreatedUserId);
            _chatService.SaveChat(chat);
        }

        //TODO Denis Вот тут добавить проверку, может ли этот пользователь отправить сообщение 
        _chatService.SaveMessage(request.Message); 

        ChatService.UserConnection[] recipientInChatConnections = _chatService.GetUserConnections(request.Message.ChatId)
            .Where(c => c.ConnectionId != senderConnectionId)
            .ToArray();

        IReadOnlyList<String> connectionIds = recipientInChatConnections.Select(r => r.ConnectionId).ToList();
        await Clients.Clients(connectionIds).SendAsync("NewMessage", request.Message); 
    }

    public override async Task OnConnectedAsync()
    {
        HttpContext? httpContext = Context.GetHttpContext();
        if (httpContext is null) throw new Exception(); 

        String? systemUserToken = httpContext.Request.Cookies[CookieNames.SystemUserToken];
        if(systemUserToken is null) throw new UnauthorizedAccessException();

        User? user = _usersService.GetUserByToken(systemUserToken);
        if (user is null) throw new UnauthorizedAccessException();

        String? chatId = httpContext.Request.Query["ChatId"];
        if (chatId is null) throw new Exception();

        String connectionId = Context.ConnectionId;

        ChatService.UserConnection userConnection = new(connectionId, Guid.Parse(chatId), user.Id);
        _chatService.SaveConnection(userConnection);

        Context.Items["UserId"] = userConnection.UserId;
        Context.Items["ChatId"] = userConnection.ChatId;

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        String connectionId = Context.ConnectionId;

        Guid? userId = Context.Items["UserId"] as Guid?;
        if (userId is not {} user) throw new UnauthorizedAccessException();

        Guid? chatId = Context.Items["ChatId"] as Guid?;
        if (chatId is not {} chat) throw new Exception();

        _chatService.RemoveConnection(connectionId, user, chat);

        await base.OnDisconnectedAsync(exception);
    }
}