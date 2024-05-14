using FoodSharing.Site.Models.Announcements;
using FoodSharing.Site.Tools.Types;

namespace FoodSharing.Site.Services.Announcements.Repositories;

public interface IAnnouncementRepository
{
    #region Announcement

    void SaveView(AnnouncementView announcementView);
    void SaveAnnouncement(AnnouncementBlank.Validated blank, Guid userId);
    Announcement? GetAnnouncement(Guid announcementId);
    Announcement[] GetAnnouncements(Guid userId);
    Announcement[] GetAnnouncements(Guid[] announcementIds);
    PagedResult<Announcement> Search(String searchText, Int32 page, Int32 pageSize);
    PagedResult<Announcement> GetAnnouncements(Guid? userId, Int32 page, Int32 pageSize);
    void RemoveAnnouncement(Guid announcementId, Guid userId);

    AnnouncementViews[] GetAnnouncementViews(Guid[] announcementIds);
    AnnouncementMessages[] GetAnnouncementMessages(Guid[] announcementIds);
    AnnouncementFavorites[] GetAnnouncementFavorites(Guid[] announcementIds);


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