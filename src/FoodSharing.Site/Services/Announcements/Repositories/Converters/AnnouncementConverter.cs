using FoodSharing.Site.Models.Announcements;
using FoodSharing.Site.Services.Announcements.Repositories.Models;

namespace FoodSharing.Site.Services.Announcements.Repositories.Converters;

public static class AnnouncementConverter
{
    public static Announcement ToAnnouncement(this AnnouncementDB db, String fileStorageHost)
    {
        String[] imagesUrls = db.ImagesUrls.Select(url => fileStorageHost + url).ToArray();

        return new Announcement(
            db.Id, db.Name, db.OwnerUserId, db.Description,
            db.CategoryId, db.GramsWeight, db.Address, imagesUrls, db.CreatedDateTimeUtc
        ); 
    }

    public static AnnouncementCategory ToAnnouncementCategory(this AnnouncementCategoryDB db)
    {
        return new AnnouncementCategory(db.Id, db.Name, db.IconUrl);
    }
}