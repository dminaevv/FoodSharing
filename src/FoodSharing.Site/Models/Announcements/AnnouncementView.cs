namespace FoodSharing.Site.Models.Announcements;

public class AnnouncementView
{
    public Guid AnnouncementId { get; }
    public Guid UserViewerId { get; }
    public DateTime ViewingDateTimeUtc { get; }

    public AnnouncementView(Guid announcementId, Guid userViewerId, DateTime viewingDateTimeUtc)
    {
        AnnouncementId = announcementId;
        UserViewerId = userViewerId;
        ViewingDateTimeUtc = viewingDateTimeUtc;
    }
}


public class AnnouncementViews
{
    public Guid AnnouncementId { get; set; }
    public Int32 Count { get; set; }
}

public class AnnouncementMessages
{
    public Guid AnnouncementId { get; set; }
    public Int32 Count { get; set; }

}

public class AnnouncementFavorites
{
    public Guid AnnouncementId { get; set; }
    public Int32 Count { get; set; }
}

