namespace FoodSharing.Site.Services.Announcements.Repositories.Models;

public class AnnouncementViewsDB
{
    public Guid AnnouncementId { get; set; }
    public Guid UserViewerId { get; set; }
    public DateTime ViewingDateTimeUtc { get; set; }
}

