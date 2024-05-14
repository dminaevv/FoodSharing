using FoodSharing.Site.Infrastructure;
using FoodSharing.Site.Models.Announcements;
using FoodSharing.Site.Services.Announcements;
using FoodSharing.Site.Tools.Types;
using Microsoft.AspNetCore.Mvc;
using System.Numerics;

namespace FoodSharing.Site.Controllers.Announcements;

public class AnnouncementController : BaseController
{
    private readonly IAnnouncementService _announcementService;

    public AnnouncementController(IAnnouncementService announcementService)
    {
        _announcementService = announcementService;
    }

    [HttpGet("/announcement/add")]
    [HttpGet("/announcement/edit/{id}")]
    [HttpGet("/announcements/search/{searchText}")]
    [HttpGet("/announcements/category/{categoryId}")]
    public IActionResult Index()
    {
        return ReactApp();
    }

    [HttpGet("/announcement/{id}")]
    public IActionResult? AnnouncementPage(String id)
    {
        Task.Run(() => _announcementService.SaveView(Guid.Parse(id), SystemUser.User));
        return ReactApp();
    }

    public record AnnouncementBlankRequest(AnnouncementBlank Blank);
    [HttpPost("/announcement/save")]
    public Result SaveAnnouncement([FromForm] AnnouncementBlank blank)
    {
        return _announcementService.SaveAnnouncement(blank, SystemUser.User); 
    }

    [HttpGet("/announcement/search")]
    public PagedResult<AnnouncementShortInfo> Search([FromQuery] String searchText, [FromQuery] Int32 page, [FromQuery] Int32 pageSize)
    {
        return _announcementService.Search(searchText, page, pageSize, SystemUser.Id);
    }

    public record GetAnnouncementRequest(Guid Id);
    [HttpPost("/announcement/get")]
    public Announcement GetAnnouncement([FromBody] GetAnnouncementRequest request)
    {
        Announcement? announcement = _announcementService.GetAnnouncement(request.Id);
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
        return _announcementService.GetAnnouncementsPageInfo(userId, page, pageSize, SystemUser.Id);
    }

    [HttpGet("/announcement/get-page")]
    public PagedResult<AnnouncementShortInfo> GetAnnouncementsPageInfo([FromQuery] Int32 page, [FromQuery] Int32 pageSize)
    {
        return _announcementService.GetAnnouncementsPageInfo(userId: null, page, pageSize, SystemUser.Id);
    }


    [HttpPost("/announcement/get-announcements-statistics")]
    public AnnouncementStatistics[] GetAnnouncementsStatistics([FromBody] Guid[] announcementIds)
    {
        return _announcementService.GetAnnouncementsStatistics(announcementIds);
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

    [HttpGet("/announcement/get-category")]
    public AnnouncementCategory GetAnnouncementCategory([FromQuery] Guid categoryId)
    {
        return _announcementService.GetAnnouncementCategory(categoryId);
    }

    #endregion Category
}