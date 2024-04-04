    using FoodSharing.Site.Models.Users;

    namespace FoodSharing.Site.Models.Announcements;

public class AnnouncementDetailInfo
{
    public Guid Id { get; }
    public String Name { get; }
    public String Description { get; }
    public AnnouncementCategory Category { get; }
    public String GramsWeight { get; }
    public String[] ImagesUrls { get; }
    public DateTime CreatedAt { get; }
    public User Owner { get;  }
    public Boolean IsFavorite { get; }

    public AnnouncementDetailInfo(
        Announcement announcement, User owner, AnnouncementCategory category, Boolean isFavorite
    )
    {
        Id = announcement.Id;
        Name = announcement.Name;
        Description = announcement.Description;
        Category = category;
        GramsWeight = announcement.GramsWeight;
        ImagesUrls = announcement.ImagesUrls;
        CreatedAt = announcement.CreatedAt;
        Owner = owner;
        IsFavorite = isFavorite;
    }
}