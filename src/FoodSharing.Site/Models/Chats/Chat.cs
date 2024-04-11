namespace FoodSharing.Site.Models.Chats;

public class Chat
{
    public Guid Id { get; }
    public Guid[] MemberIds { get; }
    public Guid? AnnouncementId { get; }

    public Chat(Guid id, Guid[] memberIds, Guid? announcementId)
    {
        Id = id;
        MemberIds = memberIds;
        AnnouncementId = announcementId;
    }

    public static Chat Create(Guid id, Guid? announcementId, params Guid[] membersIds)
    {
        return new Chat(id, membersIds, announcementId); 
    }
} 