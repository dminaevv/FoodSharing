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
}