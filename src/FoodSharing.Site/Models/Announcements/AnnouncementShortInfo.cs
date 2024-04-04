     namespace FoodSharing.Site.Models.Announcements;

public class AnnouncementShortInfo
{
    public Guid Id { get; }
    public String Name { get; }
    public String Description { get; }
    public String MainImgUrl { get; }
    public DateTime CreatedAt { get; }
    public Boolean IsFavorite { get; }

    public AnnouncementShortInfo(Announcement announcement, bool isFavorite)
    {
        Id = announcement.Id;
        Name = announcement.Name;
        Description = announcement.Description;
        MainImgUrl = announcement.ImagesUrls[0];
        CreatedAt = announcement.CreatedAt;
        IsFavorite = isFavorite;
    }
}