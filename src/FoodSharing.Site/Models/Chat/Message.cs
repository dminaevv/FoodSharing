namespace FoodSharing.Site.Models.Chat;

public class Message
{
    public Guid Id { get; }
    public Guid DialogId { get; set; }
    public Guid FromUserId { get; }
    public Guid ToUserId { get; }
    public String Content { get; }
    public DateTime CreatedAt { get; }

    public Message(Guid id, Guid fromUserId, Guid toUserId, String content, DateTime createdAt)
    {
        Id = id;
        FromUserId = fromUserId;
        ToUserId = toUserId;
        Content = content;
        CreatedAt = createdAt;
    }
}