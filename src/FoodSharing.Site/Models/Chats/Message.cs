namespace FoodSharing.Site.Models.Chats;

public class Message
{
    public Guid Id { get; }
    public Guid ChatId { get; set; }
    public String Content { get; }
    public Guid CreatedUserId { get; }
    public DateTime CreatedDateTimeUtc { get; }

    public Message(Guid id, Guid chatId, Guid createdUserId, String content, DateTime createdDateTimeUtc)
    {
        Id = id;
        ChatId = chatId;
        CreatedUserId = createdUserId;
        Content = content;
        CreatedDateTimeUtc = createdDateTimeUtc;
    }
}