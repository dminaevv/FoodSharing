namespace FoodSharing.Site.Models.Users;

public class UserInfo
{
    public Guid Id { get; }
    public String Email { get; }
    public String? FirstName { get; }
    public String? LastName { get; }
    public String? Phone { get; }
    public String? AvatarUrl { get; }
    public DateTime RegistrationDate { get; }

    public UserInfo(
        Guid id, String email, String? firstName, String? lastName,
        String? phone, String? avatarUrl, DateTime registrationDate
    )
    {
        Id = id;
        Email = email;
        FirstName = firstName;
        LastName = lastName;
        Phone = phone;
        AvatarUrl = avatarUrl;
        RegistrationDate = registrationDate;
    }
}