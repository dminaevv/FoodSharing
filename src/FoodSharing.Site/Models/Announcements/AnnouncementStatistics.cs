namespace FoodSharing.Site.Models.Announcements;

public class AnnouncementStatistics
{
    public Guid AnnouncementId { get; }
    public Int32 ViewsCount { get; }
    public Int32 FavoriteCount { get; }
    public Int32 MessageCount { get; }

    public AnnouncementStatistics(Guid announcementId, Int32 viewsCount, Int32 favoriteCount, Int32 messageCount)
    {
        AnnouncementId = announcementId;
        ViewsCount = viewsCount;
        FavoriteCount = favoriteCount;
        MessageCount = messageCount;
    }
}
