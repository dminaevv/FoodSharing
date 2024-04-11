namespace FoodSharing.Site.Services.Chat.Repositories.Models;

public class MessageDB
{
    public Guid Id  { get; set; }
    public Guid ChatId { get; set; }
    public String Content  { get; set; }
    public Guid CreatedUserId { get; set; }
    public DateTime CreatedDateTimeUtc  { get; set; }
    public DateTime? ModifiedDateTimeUtc  { get; set; }
    public Boolean IsRemoved  { get; set; }
}