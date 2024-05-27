using FoodSharing.Site.Models.Chats;

namespace FoodSharing.Site.Services.Chat.Repositories;

public interface IChatRepository
{
    #region Chats

    void SaveChat(Site.Models.Chats.Chat chat);
    Site.Models.Chats.Chat? GetChat(Guid chatId);
    Site.Models.Chats.Chat[] GetChats(Guid userId);

    Site.Models.Chats.Chat? GetChatByAnnouncementId(Guid chatId, Guid requestedUserId);

    #endregion Chats

    #region Messages
    void SaveMessage(Message message);
    Message[] GetMessages(Guid dialogId);
    Message[] GetUnReadMessages(Guid userId, Guid chatId);
    Message[] GetMessages(Guid[] messageIds);
    void MarkMessagesAsRead(Guid[] messageIds);

    #endregion Messages
}