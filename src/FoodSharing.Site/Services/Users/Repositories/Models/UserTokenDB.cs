namespace FoodSharing.Site.Services.Users.Repositories.Models;

public class UserTokenDB
{
    public String Token { get; set; }
    public Guid  UserId { get; set; }
    public DateTimeOffset ExpirationDateTimeUtc { get; set; }
}