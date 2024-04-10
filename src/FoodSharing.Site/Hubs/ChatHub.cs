using FoodSharing.Site.Infrastructure;
using FoodSharing.Site.Models.Chats;
using FoodSharing.Site.Models.Users;
using FoodSharing.Site.Services.Chat;
using FoodSharing.Site.Services.Users;
using Microsoft.AspNetCore.SignalR;

namespace FoodSharing.Site.Hubs;

public class ChatHub: Hub
{
    private readonly IUsersService _usersService;
    private readonly IChatService _chatService;

    private ChatService.UserConnection[] _connections => _chatService.GetConnections();

    public ChatHub(IUsersService usersService, IChatService chatService)
    {
        _usersService = usersService;
        _chatService = chatService;
    }

    public async Task SendMessage(Message message)
    {
        String senderConnectionId = Context.ConnectionId;
        
        //TODO Denis Вот тут добавить проверку, может ли этот пользователь отправить сообщение 
        _chatService.SaveMessage(message); 

        ChatService.UserConnection[] recipientInChatConnections = _chatService.GetUserConnections(message.ChatId)
            .Where(c => c.ConnectionId != senderConnectionId)
            .ToArray();

        IReadOnlyList<String> connectionIds = recipientInChatConnections.Select(r => r.ConnectionId).ToList();
        await Clients.Clients(connectionIds).SendAsync("NewMessage", message); 
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