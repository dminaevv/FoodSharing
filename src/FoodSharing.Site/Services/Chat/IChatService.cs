﻿using FoodSharing.Site.Models.Chats;
using FoodSharing.Site.Models.Users;
using FoodSharing.Site.Tools.Types;
using static FoodSharing.Site.Services.Chat.ChatService;

namespace FoodSharing.Site.Services.Chat;

public interface IChatService
{
    #region UserConnection

    void SaveConnection(UserConnection connection);
    UserConnection[] GetConnections();
    UserConnection[] GetUserConnections(Guid chatId);
    void RemoveConnection(String connectionId, Guid userId, Guid dialogId);

    #endregion UserConnection

    #region Chats

    Result SaveChat(Models.Chats.Chat chat);
    Models.Chats.Chat? GetChat(Guid chatId);
    (Models.Chats.Chat? chat, Message[] messages, User[] members) GetChatByAnnouncementId(Guid chatId, User requestedUser);

    #endregion Chats

    #region Messages

    Result SaveMessage(Message message);
    Message[] GetMessages(Guid chatId);


    #endregion Messages

}