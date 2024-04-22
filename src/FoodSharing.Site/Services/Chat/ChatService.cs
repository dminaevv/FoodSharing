using FoodSharing.Site.Models.Chats;
using FoodSharing.Site.Models.Users;
using FoodSharing.Site.Services.Chat.Repositories;
using FoodSharing.Site.Services.Users;
using FoodSharing.Site.Tools.Types;

namespace FoodSharing.Site.Services.Chat;

public class ChatService : IChatService
{
    private readonly IChatRepository _chatRepository;
    private readonly IUsersService _usersService;

    public record UserConnection(String ConnectionId, Guid ChatId, Guid UserId);

    private readonly List<UserConnection> _userConnections = new();

    public ChatService(IChatRepository chatRepository, IUsersService usersService)
    {
        _chatRepository = chatRepository;
        _usersService = usersService;
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

    #endregion
}


