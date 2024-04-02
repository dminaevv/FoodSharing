using System.Text.Json.Serialization;

namespace FoodSharing.Site.Models.Users;

public class User
{
    public Guid Id { get; }
    public String Email { get; }
    [JsonIgnore]
    public String PasswordHash { get; }
    public String? FirstName { get; }
    public String? LastName { get; }
    public String? Phone { get; }
    public String? AvatarUrl { get; }
    public DateTime RegistrationDate { get; }

    public User(
        Guid id, String email, String passwordHash, String? firstName,
        String? lastName, String? phone, String? avatarUrl,
        DateTime registrationDate
    )
    {
        Id = id;
        Email = email;
        PasswordHash = passwordHash;
        FirstName = firstName;
        LastName = lastName;
        Phone = phone;
        AvatarUrl = avatarUrl;
        RegistrationDate = registrationDate;
    }
}