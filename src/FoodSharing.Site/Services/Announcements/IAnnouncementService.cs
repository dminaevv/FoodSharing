using FoodSharing.Site.Models.Announcements;
using FoodSharing.Site.Models.Users;
using FoodSharing.Site.Tools.Types;

namespace FoodSharing.Site.Services.Announcements;

public interface IAnnouncementService
{
    #region Announcement

    Result SaveAnnouncement(AnnouncementBlank blank, User requestedUser);
    Announcement? GetAnnouncement(Guid announcementId);
    AnnouncementDetailInfo GetAnnouncementInfo(Guid announcementId, Guid requestedUserId);
    Announcement[] GetAnnouncements(Guid userId);
    PagedResult<AnnouncementShortInfo> GetAnnouncementsPageInfo(Guid? userId, Int32 page, Int32 pageSize);
    Result RemoveAnnouncement(Guid announcementId, Guid userId);

    #endregion

    #region FavoriteAnnouncements

    void ToggleFavoriteAnnouncement(Guid announcementId, Guid userId);
    void AddFavoriteAnnouncement(Guid announcementId, Guid userId);
    Announcement? GetFavoriteAnnouncement(Guid announcementId, Guid userId);
    Announcement[] GetFavoriteAnnouncements(Guid userId);
    AnnouncementShortInfo[] GetFavoriteAnnouncementsShortInfo(Guid userId);
    void RemoveFavoriteAnnouncement(Guid announcementId, Guid userId);

    #endregion

    #region AnnouncementCategory

    AnnouncementCategory GetAnnouncementCategory(Guid categoryId);
    AnnouncementCategory[] GetAnnouncementCategories();


    #endregion AnnouncementCategory

}