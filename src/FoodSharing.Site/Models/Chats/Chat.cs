namespace FoodSharing.Site.Models.Chats;

public class Chat
{
    public Guid Id { get; }
    public Guid[] MemberIds { get; }
    public Guid? AnnouncementId { get; }
    public Guid LastMessageId { get; }

    public Chat(Guid id, Guid[] memberIds, Guid? announcementId, Guid lastMessageId)
    {
        Id = id;
        MemberIds = memberIds;
        AnnouncementId = announcementId;
        LastMessageId = lastMessageId;
    }

    public static Chat Create(Guid id, Guid? announcementId, Guid lastMessageId, params Guid[] membersIds)
    {
        return new Chat(id, membersIds, announcementId, lastMessageId); 
    }
} 