using FoodSharing.Site.Models.Chats;
using FoodSharing.Site.Services.Chat.Repositories.Models;

namespace FoodSharing.Site.Services.Chat.Repositories.Converters;

public static class ChatConverter
{
    public static Message ToMessage(this MessageDB db)
    {
        return new Message(db.Id, db.ChatId, db.CreatedUserId, db.Content, db.CreatedDateTimeUtc); 
    }

    public static Site.Models.Chats.Chat ToChat(this ChatDB db)
    {
        return new Site.Models.Chats.Chat(db.Id, db.MemberIds, db.AnnouncementId);
    }
}