namespace FoodSharing.Site.Services.Chat.Repositories.Models;

public class DialogDB
{
    public Guid Id   { get; set; }
    public Guid FromUserId   { get; set; }
    public String FromUserName   { get; set; }
    public Byte[] FromUserAvatar   { get; set; }
    public Guid ToUserId   { get; set; }
    public String ToUserName   { get; set; }
    public Byte[] ToUserAvatar   { get; set; }
    public String Content   { get; set; }
    public String LastMessageTime   { get; set; }
    public DateTimeOffset CreatedDateTimeUtc  { get; set; }
    public DateTimeOffset? ModifiedDateTimeUtc  { get; set; }
    public Boolean IsRemoved  { get; set; }

}