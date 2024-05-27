using FoodSharing.Site.Models.Announcements;
using FoodSharing.Site.Models.Chats;
using FoodSharing.Site.Models.Users;
using FoodSharing.Site.Services.Announcements;
using FoodSharing.Site.Services.Chat.Repositories;
using FoodSharing.Site.Services.Users;
using FoodSharing.Site.Tools.Types;

namespace FoodSharing.Site.Services.Chat;

public class ChatService : IChatService
{
    private readonly IChatRepository _chatRepository;
    private readonly IUsersService _usersService;
    private readonly IAnnouncementService _announcementService;

    public record UserConnection(String ConnectionId, Guid ChatId, Guid UserId);

    private readonly List<UserConnection> _userConnections = new();

    public ChatService(IChatRepository chatRepository, IUsersService usersService, IAnnouncementService announcementService)
    {
        _chatRepository = chatRepository;
        _usersService = usersService;
        _announcementService = announcementService;
    }

    #region UserConnection

    public void SaveConnection(UserConnection connection)
    {
        _userConnections.Add(connection);
    }

    public UserConnection[] GetConnections()
    {
        return _userConnections.ToArray();
    }

    public UserConnection[] GetUserConnections(Guid chatId)
    {
        return _userConnections
            .Where(c => c.ChatId == chatId)
            .ToArray();
    }

    public void RemoveConnection(String connectionId, Guid userId, Guid dialogId)
    {
        UserConnection? deletedItem = _userConnections.FirstOrDefault(c =>
            c.ConnectionId == connectionId
            && c.UserId == userId
            && c.ChatId == dialogId
        );
        if (deletedItem is null) return;

        _userConnections.Remove(deletedItem);
    }

    #endregion

    #region Chats

    public Result SaveChat(Models.Chats.Chat chat)
    {
        _chatRepository.SaveChat(chat);

        return Result.Success();
    }

    public Models.Chats.Chat? GetChat(Guid chatId)
    {
        return _chatRepository.GetChat(chatId);
    }

    public (Models.Chats.Chat[], Message[], User[], Announcement[]) GetChats(Guid userId)
    {
        Models.Chats.Chat[] chats = _chatRepository.GetChats(userId);

        Guid[] lastMessageIds = chats.Select(c => c.LastMessageId).ToArray();
        Message[] lasMessages = GetMessages(lastMessageIds);

        Guid[] chatMembers = chats.SelectMany(c => c.MemberIds).ToArray();
        User[] users = _usersService.GetUsers(chatMembers);

        Guid[] announcementIds = chats.Where(c => c.AnnouncementId is not null).Select(c => c.AnnouncementId!.Value).ToArray();
        Announcement[] announcements = _announcementService.GetAnnouncements(announcementIds);

        return (chats, lasMessages, users, announcements);
    }

    public (Models.Chats.Chat? chat, Message[] messages, User[] members) GetChat(Guid chatId, User requestedUser)
    {
        Models.Chats.Chat? chat = _chatRepository.GetChat(chatId);
        if (chat is null) throw new Exception($"Не удалось найти чат с id {chatId}");

        User[] members = _usersService.GetUsers(chat.MemberIds);
        Message[] messages = GetMessages(chat.Id);

        return (chat, messages, members.ToArray());
    }

    public (Models.Chats.Chat? chat, Message[] messages, User[] members) GetChatByAnnouncementId(Guid announcementId, User requestedUser)
    {
        User? ownerAnnouncement = _usersService.GetUserByAnnouncement(announcementId);
        if (ownerAnnouncement is null) throw new Exception();

        List<User> chatMembers = new() { requestedUser, ownerAnnouncement };

        Models.Chats.Chat? chat = _chatRepository.GetChatByAnnouncementId(announcementId, requestedUser.Id);
        if (chat is null) return (chat, new Message[0], chatMembers.ToArray());

        Guid[] membersIds = chat.MemberIds.Where(id => chatMembers.All(m => m.Id != id)).ToArray();
        User[] members = _usersService.GetUsers(membersIds);
        chatMembers.AddRange(members);

        Message[] messages = GetMessages(chat.Id);

        return (chat, messages, chatMembers.ToArray());
    }

    #endregion Chats

    #region Messages

    public Result SaveMessage(Message message)
    {
        _chatRepository.SaveMessage(message);
        return Result.Success();
    }

    public Message[] GetMessages(Guid chatId)
    {
        return _chatRepository.GetMessages(chatId);
    }

    public Message[] GetUnReadMessages(Guid userId, Guid chatId)
    {
        return _chatRepository.GetUnReadMessages(userId, chatId);
    }

    public void MarkMessagesAsRead(Guid[] messageIds)
    {
        _chatRepository.MarkMessagesAsRead(messageIds);
    }

    public Message[] GetMessages(Guid[] messageIds)
    {
        return _chatRepository.GetMessages(messageIds);
    }

    #endregion
}


