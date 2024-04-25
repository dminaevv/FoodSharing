using FoodSharing.Site.Models.Chats;
using FoodSharing.Site.Services.Chat.Repositories.Converters;
using FoodSharing.Site.Services.Chat.Repositories.Models;
using FoodSharing.Site.Tools.Database;
using Npgsql;

namespace FoodSharing.Site.Services.Chat.Repositories;

public class ChatRepository : IChatRepository
{
    private readonly IMainConnector _mainConnector;

    public ChatRepository(IMainConnector mainConnector)
    {
        _mainConnector = mainConnector;
    }

    #region Chats

    public void SaveChat(Site.Models.Chats.Chat chat)
    {
        String expression = @"
        INSERT INTO chats
        (
            id, memberids, announcementid, createddatetimeutc,
            lastmessageid, modifieddatetimeutc, isremoved
        )
        VALUES
        (
            @p_id, @p_memberIds, @p_announcementId, @p_dateTimeUtcNow, 
             @p_lastMessageId, null, false 
        )
         ON CONFLICT (id)
         DO UPDATE SET
         memberids = @p_memberIds,
         lastmessageid = @p_lastMessageId,
         modifieddatetimeutc = @p_dateTimeUtcNow";

        DateTime utcNow = DateTime.UtcNow;
        NpgsqlParameter[] parameters =
        {
            new("p_id", chat.Id),
            new("p_memberIds", chat.MemberIds),
            new("p_announcementId", chat.AnnouncementId),
            new("p_dateTimeUtcNow", utcNow),
            new("p_lastMessageId", chat.LastMessageId),
        };

        _mainConnector.ExecuteNonQuery(expression, parameters);

    }

    public Site.Models.Chats.Chat? GetChat(Guid chatId)
    {
        String expression = @"SELECT * FROM chats WHERE id = @p_chatId AND isremoved = false";
        NpgsqlParameter[] parameters =
        {
            new("p_chatId", chatId)
        };

        return _mainConnector.Get<ChatDB?>(expression, parameters)?.ToChat();
    }

    public Site.Models.Chats.Chat[] GetChats(Guid userId)
    {
        String expression = @"SELECT * FROM chats WHERE @p_userId = ANY(memberids)";
        NpgsqlParameter[] parameters =
        {
            new("p_userId", userId)
        };

        return _mainConnector.GetList<ChatDB>(expression, parameters).Select(c => c.ToChat()).ToArray();
    }

    public Site.Models.Chats.Chat? GetChatByAnnouncementId(Guid announcementId, Guid requestedUserId)
    {
        String expression = @"SELECT * FROM chats WHERE announcementId = @p_announcementId AND @p_requestedUserId = ANY(memberids)";
        NpgsqlParameter[] parameters =
        {
            new("p_announcementId", announcementId), 
            new("p_requestedUserId", requestedUserId) 
        };

        return _mainConnector.Get<ChatDB?>(expression, parameters)?.ToChat();
    }

    #endregion Chats

    #region Messages

    public void SaveMessage(Message message)
    {
        String expression = @"
        INSERT INTO messages
        (
            id, chatid, ""content"", createduserid, 
            createddatetimeutc, isremoved   
        )
        VALUES(
             @p_id, @p_chatId, @p_content, @p_createdUserId,
             @p_createdDateTimeUtc, false
        )
         ON CONFLICT (id)
         DO UPDATE SET
         content = @p_content,
         modifieddatetimeutc = @p_dateTimeUtcNow";

        DateTime utcNow = DateTime.UtcNow;
        NpgsqlParameter[] parameters =
        {
             new("p_id", message.Id),
             new("p_chatId", message.ChatId),
             new("p_content", message.Content),
             new("p_createdUserId", message.CreatedUserId),
             new("p_createdDateTimeUtc", message.CreatedDateTimeUtc),
             new("p_dateTimeUtcNow", utcNow)

        };

        _mainConnector.ExecuteNonQuery(expression, parameters);

        String updateChatExpression = @"UPDATE chats SET lastmessageid = @p_messageId WHERE id = @p_chatId";
        NpgsqlParameter[] updateChatExpressionParameters =
        {
            new("p_messageId", message.Id),
            new("p_chatId", message.ChatId),
        };

        _mainConnector.ExecuteNonQuery(updateChatExpression, updateChatExpressionParameters);
    }

    public Message[] GetMessages(Guid dialogId)
    {
        String expression = @"SELECT * FROM messages WHERE chatId = @p_chatId ORDER BY createddatetimeutc";
        NpgsqlParameter[] parameters =
        {
            new("p_chatId", dialogId)
        };

        return _mainConnector.GetList<MessageDB>(expression, parameters).Select(message => message.ToMessage()).ToArray();
    }

    public Message[] GetMessages(Guid[] messageIds)
    {
        String expression = @"SELECT * FROM messages WHERE id = ANY(@p_messageIds) ORDER BY createddatetimeutc";
        NpgsqlParameter[] parameters =
        {
            new("p_messageIds", messageIds)
        };

        return _mainConnector.GetList<MessageDB>(expression, parameters).Select(message => message.ToMessage()).ToArray();
    }

    #endregion Messages

}