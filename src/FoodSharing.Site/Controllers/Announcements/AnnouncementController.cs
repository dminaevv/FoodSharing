using FoodSharing.Site.Infrastructure;
using FoodSharing.Site.Models.Announcements;
using FoodSharing.Site.Services.Announcements;
using FoodSharing.Site.Tools.Types;
using Microsoft.AspNetCore.Mvc;

namespace FoodSharing.Site.Controllers.Announcements;

public class AnnouncementController : BaseController
{
    private readonly IAnnouncementService _announcementService;

    public AnnouncementController(IAnnouncementService announcementService)
    {
        _announcementService = announcementService;
    }

    [HttpGet("/announcement/{id}")]
    [HttpGet("/announcement/add")]
    [HttpGet("/announcement/edit/{id}")]
    public IActionResult Index()
    {
        return ReactApp();
    }

    public record UploadPhotosRequest(AnnouncementBlank blank, IFormFile[] uploadPhotos);
    [HttpPost("/announcement/save")]
    public Result SaveAnnouncement(UploadPhotosRequest uploadPhotos)
    {
        return Result.Success();
    }

    public record GetAnnouncementRequest(Guid Id);
    [HttpPost("/announcement/get")]
    public Announcement GetAnnouncement([FromBody] GetAnnouncementRequest request)
    {
        Announcement? announcement =  _announcementService.GetAnnouncement(request.Id);
        if (announcement is null) throw new Exception($"Не удалось найти Announcement с id {request.Id}");

        return announcement;
    }

    [HttpPost("/announcement/get-my")]
    public Announcement[] GetMyAnnouncements()
    {
        return _announcementService.GetAnnouncements(SystemUser.Id);
    }

    public record GetAnnouncementInfoRequest(Guid Id);
    [HttpPost("/announcement/get-info")]
    public AnnouncementDetailInfo GetAnnouncementInfo([FromBody] GetAnnouncementRequest request)
    {
        return _announcementService.GetAnnouncementInfo(request.Id, SystemUser.Id);
    }

    [HttpGet("/announcement/get-user")]
    public PagedResult<AnnouncementShortInfo> GetUserAnnouncementsPageInfo([FromQuery] Guid userId, [FromQuery] Int32 page, [FromQuery] Int32 pageSize)
    {
        return _announcementService.GetAnnouncementsPageInfo(userId, page, pageSize);
    }

    [HttpGet("/announcement/get-page")]
    public PagedResult<AnnouncementShortInfo> GetAnnouncementsPageInfo([FromQuery] Int32 page, [FromQuery] Int32 pageSize)
    {
        return _announcementService.GetAnnouncementsPageInfo(SystemUser.Id, page, pageSize);
    }

    public record RemoveAnnouncementRequest(Guid Id);
    [HttpPost("/announcement/remove")]
    public Result RemoveAnnouncement([FromBody] RemoveAnnouncementRequest request)
    {
       return _announcementService.RemoveAnnouncement(request.Id, SystemUser.Id);
    }


    [HttpGet("/announcement/favorite/get-all")]
    public AnnouncementShortInfo[] AddFavoriteAnnouncement()
    {
        return _announcementService.GetFavoriteAnnouncementsShortInfo(SystemUser.Id);
    }

    public record AddFavoriteAnnouncementRequest(Guid AnnouncementId);
    [HttpPost("/announcement/favorite/toggle")]
    public void AddFavoriteAnnouncement([FromBody] AddFavoriteAnnouncementRequest request)
    {
        _announcementService.ToggleFavoriteAnnouncement(request.AnnouncementId, SystemUser.Id);
    }

    #region Category

    [HttpGet("/announcement/get-categories")]
    public AnnouncementCategory[] GetAllAnnouncementCategories()
    {
        return _announcementService.GetAnnouncementCategories();
    }

    #endregion Category
}