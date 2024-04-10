using FoodSharing.Site.Models.Chats;
using FoodSharing.Site.Services.Chat.Repositories;
using FoodSharing.Site.Tools.Types;

namespace FoodSharing.Site.Services.Chat;

public class ChatService : IChatService
{
    private readonly IChatRepository _chatRepository;

    public record UserConnection(String ConnectionId, Guid ChatId, Guid UserId);

    private readonly List<UserConnection> _userConnections = new();

    public ChatService(IChatRepository chatRepository)
    {
        _chatRepository = chatRepository;
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


