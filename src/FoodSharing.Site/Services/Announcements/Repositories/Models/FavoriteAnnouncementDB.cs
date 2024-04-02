namespace FoodSharing.Site.Services.Announcements.Repositories.Models;

public class FavoriteAnnouncementDB
{
    public Guid Id  { get; set; }
    public Guid AnnouncementId  { get; set; }
    public Guid UserId  { get; set; }
}