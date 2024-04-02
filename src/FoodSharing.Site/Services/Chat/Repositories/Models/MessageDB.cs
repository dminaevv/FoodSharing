namespace FoodSharing.Site.Services.Chat.Repositories.Models;

public class MessageDB
{
    public Guid Id  { get; set; }
    public Guid DialogId { get; set; }
    public Guid FromUserId  { get; set; }
    public Guid ToUserId  { get; set; }
    public String Content  { get; set; }
    public DateTimeOffset CreatedDateTimeUtc  { get; set; }
    public DateTimeOffset? ModifiedDateTimeUtc  { get; set; }
    public Boolean IsRemoved  { get; set; }
}