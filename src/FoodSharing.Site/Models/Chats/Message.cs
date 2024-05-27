namespace FoodSharing.Site.Models.Chats;

public class Message
{
    public Guid Id { get; }
    public Guid ChatId { get; set; }
    public String Content { get; }
    public Guid CreatedUserId { get; }
    public MessageStatus Status { get; }
    public DateTime CreatedDateTimeUtc { get; }

    public Message(
        Guid id, Guid chatId, String content, Guid createdUserId,
        MessageStatus status, DateTime createdDateTimeUtc
    )
    {
        Id = id;
        ChatId = chatId;
        Content = content;
        CreatedUserId = createdUserId;
        Status = status;
        CreatedDateTimeUtc = createdDateTimeUtc;
    }
}