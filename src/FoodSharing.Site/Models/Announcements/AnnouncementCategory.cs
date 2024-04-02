namespace FoodSharing.Site.Models.Announcements;

public class AnnouncementCategory
{
    public Guid Id { get; }
    public String Name { get; }
    public String IconUrl { get; }

    public AnnouncementCategory(Guid id, String name, String iconUrl)
    {
        Id = id;
        Name = name;
        IconUrl = iconUrl;
    }
}