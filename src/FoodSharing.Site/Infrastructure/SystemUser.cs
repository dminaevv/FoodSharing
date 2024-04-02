using FoodSharing.Site.Models.Users;

namespace FoodSharing.Site.Infrastructure;

public class SystemUser
{
    public Guid Id { get; }
    public String Email { get; }
    public User User { get; }

    public SystemUser(User user)
    {
        Id = user.Id;
        Email = user.Email;
        User = user;
    }
}
