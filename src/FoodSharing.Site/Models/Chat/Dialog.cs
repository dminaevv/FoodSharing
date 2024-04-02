namespace FoodSharing.Site.Models.Chat;

public class Dialog
{
    public Guid Id  { get; }
    public Guid FromUserId  { get; }
    public String FromUserName  { get; }
    public Byte[] FromUserAvatar  { get; }
    public Guid ToUserId  { get; }
    public String ToUserName  { get; }
    public Byte[] ToUserAvatar  { get; }
    public String Content  { get; }
    public DateTime CreatedAt  { get; }

    public String LastMessageTime  { get; }

    public Dialog(
        Guid id, Guid fromUserId, String fromUserName, Byte[] fromUserAvatar, 
        Guid toUserId, String toUserName, Byte[] toUserAvatar, String content,
        DateTime createdAt, String lastMessageTime
    )
    {
        Id = id;
        FromUserId = fromUserId;
        FromUserName = fromUserName;
        FromUserAvatar = fromUserAvatar;
        ToUserId = toUserId;
        ToUserName = toUserName;
        ToUserAvatar = toUserAvatar;
        Content = content;
        CreatedAt = createdAt;
        LastMessageTime = lastMessageTime;
    }
}