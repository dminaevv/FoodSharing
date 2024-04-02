using FoodSharing.Site.Models.Announcements;
using FoodSharing.Site.Tools.Types;

namespace FoodSharing.Site.Services.Announcements;

public interface IAnnouncementService
{
    #region Announcement

    Result SaveAnnouncement(AnnouncementBlank blank, Guid userId);
    Announcement? GetAnnouncement(Guid announcementId);
    AnnouncementDetailInfo GetAnnouncementInfo(Guid announcementId);
    Announcement[] GetAnnouncements(Guid userId);
    PagedResult<AnnouncementShortInfo> GetAnnouncementsPageInfo(Guid? userId, Int32 page, Int32 pageSize);
    Result RemoveAnnouncement(Guid announcementId, Guid userId);

    #endregion

    #region FavoriteAnnouncements

    void AddFavoriteAnnouncement(Guid announcementId, Guid userId);
    Announcement? GetFavoriteAnnouncement(Guid announcementId, Guid userId);
    Announcement[] GetFavoriteAnnouncements(Guid userId);
    void RemoveFavoriteAnnouncement(Guid announcementId, Guid userId);

    #endregion

    #region AnnouncementCategory

    AnnouncementCategory GetAnnouncementCategory(Guid categoryId);
    AnnouncementCategory[] GetAnnouncementCategories();


    #endregion AnnouncementCategory

}