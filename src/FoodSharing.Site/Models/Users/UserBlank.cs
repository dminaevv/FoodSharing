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
    public IFormFile? AvatarFile { get; set; }
    public String? AvatarUrl { get; set; }
}

public partial class UserBlank
{
    public class Validated
    {
        public Guid Id { get; }
        public String Email { get; }
        public String PasswordHash { get; }
        public String? FirstName { get; }
        public String? LastName { get; }
        public String? Phone { get; }
        public IFormFile? AvatarFile { get; }
        public String? AvatarUrl { get; }

        public Validated(
            Guid id, String email, String passwordHash, String? firstName,
            String? lastName, String? phone, IFormFile? avatarFile, String? avatarUrl
        )
        {
            Id = id;
            Email = email;
            PasswordHash = passwordHash;
            FirstName = firstName;
            LastName = lastName;
            Phone = phone;
            AvatarFile = avatarFile;
            AvatarUrl = avatarUrl;
        }
    }
}