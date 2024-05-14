     namespace FoodSharing.Site.Models.Announcements;

public class AnnouncementShortInfo
{
    public Guid Id { get; }
    public String Name { get; }
    public String Description { get; }
    public String Address { get; }
    public String MainImgUrl { get; }
    public DateTime CreatedAt { get; }
    public Boolean IsFavorite { get; }

    public AnnouncementShortInfo(
       Announcement announcement, Boolean isFavorite
    )
    {
        Id = announcement.Id;
        Name = announcement.Name;
        Description = announcement.Description;
        Address = announcement.Address;
        MainImgUrl = announcement.ImagesUrls[0];
        CreatedAt = announcement.CreatedAt;
        IsFavorite = isFavorite;
    }
}