namespace FoodSharing.Site.Services.Users.Repositories.Models;

public class UserDB
{
    public Guid Id  { get; set; }
    public String Email  { get; set; }
    public String PasswordHash  { get; set; }
    public String? FirstName  { get; set; }
    public String? LastName  { get; set; }
    public String? Phone  { get; set; }
    public String? AvatarUrl  { get; set; }
    public Guid CreatedUserId  { get; set; }
    public Guid? ModifiedUserId  { get; set; }
    public DateTime CreatedDateTimeUtc { get;  }
    public DateTime? ModifiedDateTimeUtc  { get; set; }
    public Boolean IsRemoved { get;}
}