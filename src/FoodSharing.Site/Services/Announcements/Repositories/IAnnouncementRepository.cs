using FoodSharing.Site.Models.Announcements;
using FoodSharing.Site.Tools.Types;

namespace FoodSharing.Site.Services.Announcements.Repositories;

public interface IAnnouncementRepository
{
    #region Announcement

    void SaveAnnouncement(AnnouncementBlank.Validated blank, Guid userId);
    Announcement? GetAnnouncement(Guid announcementId);
    Announcement[] GetAnnouncements(Guid userId);
    Announcement[] GetAnnouncements(Guid[] announcementIds);
    PagedResult<Announcement> Search(String searchText, Int32 page, Int32 pageSize); 
    PagedResult<Announcement> GetAnnouncements(Guid? userId, Int32 page, Int32 pageSize);
    void RemoveAnnouncement(Guid announcementId, Guid userId);

    #endregion

    #region FavoriteAnnouncements
    void AddFavoriteAnnouncement(Guid announcementId, Guid userId);
    Announcement? GetFavoriteAnnouncement(Guid announcementId, Guid userId);
    Announcement[] GetFavoriteAnnouncements(Guid userId);
    void RemoveFavoriteAnnouncement(Guid announcementId, Guid userId);

    #endregion

    #region AnnouncementCategory

    AnnouncementCategory? GetAnnouncementCategory(Guid categoryId);
    AnnouncementCategory[] GetAnnouncementCategories();


    #endregion AnnouncementCategory

}