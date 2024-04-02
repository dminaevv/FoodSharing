using FoodSharing.Site.Models.Announcements;
using FoodSharing.Site.Services.Announcements.Repositories.Models;

namespace FoodSharing.Site.Services.Announcements.Repositories.Converters;

public static class AnnouncementConverter
{
    public static Announcement ToAnnouncement(this AnnouncementDB db)
    {
        return new Announcement(
            db.Id, db.Name, db.OwnerUserId, db.Description,
            db.CategoryId, db.GramsWeight, db.ImagesUrls, db.CreatedDateTimeUtc
        ); 
    }

    public static AnnouncementCategory ToAnnouncementCategory(this AnnouncementCategoryDB db)
    {
        return new AnnouncementCategory(db.Id, db.Name, db.IconUrl);
    }
}