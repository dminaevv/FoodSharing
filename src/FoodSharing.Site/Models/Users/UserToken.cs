namespace FoodSharing.Site.Models.Users;

public class UserToken
{
    public String Token { get; }
    public Guid  UserId { get; }
    public DateTimeOffset ExpirationDateTimeUtc { get; }

    public UserToken(String token, Guid userId, DateTimeOffset expirationDateTimeUtc)
    {
        Token = token;
        UserId = userId;
        ExpirationDateTimeUtc = expirationDateTimeUtc;
    }

    public static UserToken New(Guid userId)
{
        const Int32 timeToLiveInDays = 7;
        DateTimeOffset expirationDateTimeUtc = DateTime.UtcNow.AddDays(timeToLiveInDays);

        return new UserToken(Guid.NewGuid().ToString(), userId, expirationDateTimeUtc);
    }
}