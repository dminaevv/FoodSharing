namespace FoodSharing.Site.Models.Users;

public partial class UserBlank
{
    public Guid? Id { get; set; }
    public String? Email { get; set; }
    public String? Password { get; set; }
    public Boolean IsPasswordWasChanged { get; set; }

    public String? FirstName { get; set; }
    public String? LastName { get; set; }
    public String? Phone { get; set; }
    public String? AvatarUrl { get; set; }
}

public partial class UserBlank
{
    public class Validated
    {
        public Guid Id { get; set; }
        public String Email { get; set; }
        public String PasswordHash { get; set; }
        public String? FirstName { get; set; }
        public String? LastName { get; set; }
        public String? Phone { get; set; }
        public String? AvatarUrl { get; set; }

        public Validated(
            Guid id, String email, String passwordHash, String? firstName,
             String? lastName, String? phone, String? avatarUrl
        )
        {
            Id = id;
            Email = email;
            PasswordHash = passwordHash;
            FirstName = firstName;
            LastName = lastName;
            Phone = phone;
            AvatarUrl = avatarUrl;
        }
    }
}