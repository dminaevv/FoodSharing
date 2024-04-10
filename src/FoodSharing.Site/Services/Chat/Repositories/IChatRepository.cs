using FoodSharing.Site.Models.Chats;

namespace FoodSharing.Site.Services.Chat.Repositories;

public interface IChatRepository
{
    #region Chats

    void SaveChat(Site.Models.Chats.Chat chat);
    Site.Models.Chats.Chat? GetChat(Guid chatId);

    #endregion Chats

    #region Messages
    void SaveMessage(Message message);
    Message[] GetMessages(Guid dialogId);

    #endregion Messages
}