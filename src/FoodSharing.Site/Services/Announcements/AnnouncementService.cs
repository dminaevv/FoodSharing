using FoodSharing.Site.Models.Announcements;
using FoodSharing.Site.Models.Users;
using FoodSharing.Site.Services.Announcements.Repositories;
using FoodSharing.Site.Services.Users;
using FoodSharing.Site.Tools.Extensions;
using FoodSharing.Site.Tools.Types;

namespace FoodSharing.Site.Services.Announcements;

public class AnnouncementService : IAnnouncementService
{
    private readonly IAnnouncementRepository _announcementRepository;
    private readonly IUsersService _usersService;

    public AnnouncementService(IAnnouncementRepository announcementRepository, IUsersService usersService)
    {
        _announcementRepository = announcementRepository;
        _usersService = usersService;
    }

    public Result SaveAnnouncement(AnnouncementBlank blank, Guid userId)
    {
        PreprocessAnnouncementBlank(blank);

        Result validateAnnouncementBlankResult = ValidateAnnouncementBlank(blank, out AnnouncementBlank.Validated validated);
        if(!validateAnnouncementBlankResult.IsSuccess) return Result.Fail(validateAnnouncementBlankResult.Errors);

        _announcementRepository.SaveAnnouncement(validated, userId);

        return Result.Success();
    }

    private void PreprocessAnnouncementBlank(AnnouncementBlank blank)
    {
        blank.Id ??= Guid.NewGuid();
        blank.Name = blank.Name?.Trim();
        blank.Description = blank.Description?.Trim();
        blank.ImagesUrls ??= Array.Empty<String>();
    }

    private Result ValidateAnnouncementBlank(AnnouncementBlank blank, out AnnouncementBlank.Validated validated)
    {
        validated = null!;

        if (blank.Id is not { } id) throw new Exception("Announcement Id null при сохранении");

        if (blank.Name.IsNullOrWhitespace()) return Result.Fail("Укажите название объявления"); 
        if (blank.OwnerUserId is not {} ownerUserId) throw new Exception("Не указан OwnerUserId при сохранении Announcement"); 
        if (blank.Description.IsNullOrWhitespace()) return Result.Fail("Заполните описание"); 
        if (blank.CategoryId is not {} categoryId) return Result.Fail("Укажите категорию для объявления"); 
        if (blank.GramsWeight is not {} weight) return Result.Fail("Укажите вес"); 
        if(weight <= 0) return Result.Fail("Укажите корректное количество");

        if (blank.ImagesUrls.IsNullOrEmpty()) return Result.Fail("Прикрепите хотя бы одно фото");

        validated = new AnnouncementBlank.Validated(
            id, blank.Name, ownerUserId, blank.Description, 
            categoryId, weight, blank.ImagesUrls!
        );

        return Result.Success();
    }

    public Announcement? GetAnnouncement(Guid announcementId)
    {
        return _announcementRepository.GetAnnouncement(announcementId); 
    }

    public AnnouncementDetailInfo GetAnnouncementInfo(Guid announcementId)
    {
        Announcement? announcement = _announcementRepository.GetAnnouncement(announcementId);
        if (announcement is null) throw new Exception($"Не удалось найти объявление id {announcementId}"); 

        User? owner = _usersService.GetUser(announcement.OwnerUserId);
        if (owner == null) throw new Exception($"Не найден владелец объявления {announcementId}");

        AnnouncementCategory category = GetAnnouncementCategory(announcement.CategoryId); 

        return new AnnouncementDetailInfo(announcement, owner, category); 
    }

    public Announcement[] GetAnnouncements(Guid userId)
    {
        return _announcementRepository.GetAnnouncements(userId); 
    }

    public PagedResult<AnnouncementShortInfo> GetAnnouncementsPageInfo(Guid? userId, Int32 page, Int32 pageSize)
    {
        PagedResult<Announcement> announcements = _announcementRepository.GetAnnouncements(userId, page, pageSize);
        AnnouncementShortInfo[] announcementInfo = announcements.Values
            .Select(a => new AnnouncementShortInfo(a))
            .ToArray();

        return new PagedResult<AnnouncementShortInfo>(announcementInfo, announcements.TotalRows);
    }

    public Result RemoveAnnouncement(Guid announcementId, Guid userId)
    {
        _announcementRepository.RemoveAnnouncement(announcementId, userId);
        
        return Result.Success();
    }

    public void AddFavoriteAnnouncement(Guid announcementId, Guid userId)
    {
        Announcement? existFavoriteAnnouncement = GetFavoriteAnnouncement(announcementId, userId);
        if (existFavoriteAnnouncement is not null) 
            throw new Exception($"Попытка добавить уже добавленный товар в избранное announcementId: {announcementId} userId: {userId}");

        _announcementRepository.AddFavoriteAnnouncement(announcementId, userId);
    }

    public Announcement? GetFavoriteAnnouncement(Guid announcementId, Guid userId)
    {
        return _announcementRepository.GetFavoriteAnnouncement(announcementId, userId);
    }

    public Announcement[] GetFavoriteAnnouncements(Guid userId)
    {
        return _announcementRepository.GetFavoriteAnnouncements(userId);
    }

    public void RemoveFavoriteAnnouncement(Guid announcementId, Guid userId)
    {
        _announcementRepository.RemoveFavoriteAnnouncement(announcementId, userId);
    }

    #region AnnouncementCategory

    public AnnouncementCategory GetAnnouncementCategory(Guid categoryId)
    {
        AnnouncementCategory? category = _announcementRepository.GetAnnouncementCategory(categoryId);
        if (category is null) throw new Exception($"Не удалось найти категорию id: {categoryId}"); 

        return category;
    }

    public AnnouncementCategory[] GetAnnouncementCategories()
    {
        return _announcementRepository.GetAnnouncementCategories(); 
    }


    #endregion AnnouncementCategory
}