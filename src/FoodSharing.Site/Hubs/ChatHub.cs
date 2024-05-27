using FoodSharing.Site.Infrastructure;
using FoodSharing.Site.Models.Announcements;
using FoodSharing.Site.Models.Chats;
using FoodSharing.Site.Models.Users;
using FoodSharing.Site.Services.Announcements;
using FoodSharing.Site.Services.Chat;
using FoodSharing.Site.Services.Users;
using FoodSharing.Site.Tools.Extensions;
using Microsoft.AspNetCore.SignalR;

namespace FoodSharing.Site.Hubs;

public class ChatHub : Hub
{
    private readonly IUsersService _usersService;
    private readonly IChatService _chatService;
    private readonly IAnnouncementService _announcementService;

    private ChatService.UserConnection[] Connections => _chatService.GetConnections();

    public ChatHub(IUsersService usersService, IChatService chatService, IAnnouncementService announcementService)
    {
        _usersService = usersService;
        _chatService = chatService;
        _announcementService = announcementService;
    }

    public record NewMessageRequest(MessageBlank MessageBlank, Guid AnnouncementId);
    public async Task<Message?> SendMessage(NewMessageRequest request)
    {
        if (request.MessageBlank.Content is not { } content || content.IsNullOrWhitespace()) return null;

        Guid userId = (Guid)(Context.Items["UserId"] as Guid?)!;
        Guid messageId = Guid.NewGuid();
        Guid chatId = (Guid)(Context.Items["ChatId"] as Guid?)!;

        Chat? existChat = _chatService.GetChat(chatId);
        if (existChat is null)
        {
            Announcement? announcement = _announcementService.GetAnnouncement(request.AnnouncementId);
            if (announcement is null) throw new Exception("");

            User? user = _usersService.GetUser(announcement.OwnerUserId);
            if (user is null) throw new Exception("");

            Chat chat = Chat.Create(
                chatId, request.AnnouncementId, messageId, user.Id,
                userId
            );
            _chatService.SaveChat(chat);
            chatId = chat.Id;
        }

        Message message = new(messageId, (Guid)chatId!, content, userId, MessageStatus.Sent, DateTime.UtcNow);
        _chatService.SaveMessage(message);

        String senderConnectionId = Context.ConnectionId;
        ChatService.UserConnection[] recipientInChatConnections = _chatService.GetUserConnections(message.ChatId)
            .Where(c => c.ConnectionId != senderConnectionId)
            .ToArray();

        IReadOnlyList<String> connectionIds = recipientInChatConnections.Select(r => r.ConnectionId).ToList();
        await Clients.Clients(connectionIds).SendAsync("NewMessage", message);

        return message;
    }

    public async Task MarkMessagesAsRead(Object parameters)
    {
        Guid userId = (Guid)(Context.Items["UserId"] as Guid?)!;
        Guid chatId = (Guid)(Context.Items["ChatId"] as Guid?)!;

        Message[] unreadMessages = _chatService.GetUnReadMessages(userId, chatId);
        Guid[] messageIds = unreadMessages.Select(m => m.Id).ToArray();
        _chatService.MarkMessagesAsRead(messageIds);

        String[] connectionIds = Connections.Where(c => c.ChatId == chatId).Select(c => c.ConnectionId).ToArray();
        await Clients.Clients(connectionIds).SendAsync("MessagesRead", messageIds);
    }

    public override async Task OnConnectedAsync()
    {
        HttpContext? httpContext = Context.GetHttpContext();
        if (httpContext is null) throw new Exception();

        String? systemUserToken = httpContext.Request.Cookies[CookieNames.SystemUserToken];
        if (systemUserToken is null) throw new UnauthorizedAccessException();

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
        if (userId is not { } user) throw new UnauthorizedAccessException();

        Guid? chatId = Context.Items["ChatId"] as Guid?;
        if (chatId is not { } chat) throw new Exception();

        _chatService.RemoveConnection(connectionId, user, chat);

        await base.OnDisconnectedAsync(exception);
    }
}