using FoodSharing.Site.Models.Announcements;
using FoodSharing.Site.Models.Files;
using FoodSharing.Site.Models.Users;
using FoodSharing.Site.Services.Announcements.Repositories;
using FoodSharing.Site.Services.Files;
using FoodSharing.Site.Services.Users;
using FoodSharing.Site.Services.Users.Repositories.Models;
using FoodSharing.Site.Tools.Extensions;
using FoodSharing.Site.Tools.Types;
using IConfiguration = FoodSharing.Site.Models.Configurations.IConfiguration;

namespace FoodSharing.Site.Services.Announcements;

public class AnnouncementService : IAnnouncementService
{
    private readonly IAnnouncementRepository _announcementRepository;
    private readonly IUsersService _usersService;
    private readonly IFileService _fileService;
    private readonly IConfiguration _configuration;

    public AnnouncementService(
        IAnnouncementRepository announcementRepository, IUsersService usersService,
        IFileService fileService, IConfiguration configuration
    )
    {
        _announcementRepository = announcementRepository;
        _usersService = usersService;
        _fileService = fileService;
        _configuration = configuration;
    }

    public void SaveView(Guid announcementId, User requestedUser)
    {
        AnnouncementView announcementView = new(announcementId, requestedUser.Id, DateTime.UtcNow);
        _announcementRepository.SaveView(announcementView); 
    }

    public Result SaveAnnouncement(AnnouncementBlank blank, User requestedUser)
    {
        PreprocessAnnouncementBlank(blank);

        Result validateAnnouncementBlankResult = ValidateAnnouncementBlank(blank, out AnnouncementBlank.Validated validated);
        if(!validateAnnouncementBlankResult.IsSuccess) return Result.Fail(validateAnnouncementBlankResult.Errors);

        if (!validated.UploadPhotos.IsEmpty())
        {
            CFile[] photoFiles = validated.UploadPhotos.Select(photo =>
            {
                String extension = Path.GetExtension(photo.FileName);
                String photoName = $"{Guid.NewGuid()}-{Guid.NewGuid()}{extension}";

                return new CFile(photoName, photo.ToBytes());
            }).ToArray();

            String[] photoUrls = _fileService.SaveAnnouncementPhotos(photoFiles);
            validated.ImagesUrls.AddRange(photoUrls);
        } 
       
        _announcementRepository.SaveAnnouncement(validated, requestedUser.Id);

        return Result.Success();
    }

    private void PreprocessAnnouncementBlank(AnnouncementBlank blank)
    {
        blank.Id ??= Guid.NewGuid();
        blank.Name = blank.Name?.Trim();
        blank.Description = blank.Description?.Trim();
        blank.ImagesUrls = blank.ImagesUrls?.Select(url => url.Replace(_configuration.FileStorage_Host, "")).ToArray() ?? Array.Empty<String>();
    }

    private Result ValidateAnnouncementBlank(AnnouncementBlank blank, out AnnouncementBlank.Validated validated)
    {
        validated = null!;

        if (blank.Id is not { } id) throw new Exception("Announcement Id null при сохранении");

        if (blank.Name.IsNullOrWhitespace()) return Result.Fail("Укажите название объявления");
        if (blank.OwnerUserId is not { } ownerUserId)
            throw new Exception("Не указан OwnerUserId при сохранении Announcement");
        if (blank.Description.IsNullOrWhitespace()) return Result.Fail("Заполните описание");
        if (blank.CategoryId is not { } categoryId) return Result.Fail("Укажите категорию для объявления");
        if (blank.GramsWeight is not { } weight) return Result.Fail("Укажите вес");
        if (blank.Address is not { } address|| address.IsNullOrWhitespace()) return Result.Fail("Укажите адрес");

        if (weight <= 0) return Result.Fail("Укажите корректное количество");

        if (blank.ImagesUrls.IsNullOrEmpty() && blank.UploadPhotos.IsNullOrEmpty())
            return Result.Fail("Прикрепите хотя бы одно фото");

        Int32 maxFileSizeInMb = 5; 
        Int64 maxFileSizeInByte = maxFileSizeInMb * 1024 * 1024;

        if (blank.UploadPhotos is not null)
        {
            if (blank.UploadPhotos.Any(photo => photo.Length >= maxFileSizeInByte))
                return Result.Fail($"Максимальный размер фото - {maxFileSizeInMb}");

            String[] allowedImageTypes = { "image/jpeg", "image/png", "image/jpg" };
            if (blank.UploadPhotos.Any(photo =>!allowedImageTypes.Contains(photo.ContentType)))
                return Result.Fail("Вы загрузили недопустимый формат фото");
        }

        validated = new AnnouncementBlank.Validated(
                id, blank.Name, ownerUserId, blank.Description,
                categoryId, weight, address, blank.ImagesUrls!, blank.UploadPhotos ?? Array.Empty<IFormFile>()
        );

        return Result.Success();
    }

    public PagedResult<AnnouncementShortInfo> Search(String searchText, Int32 page, Int32 pageSize, Guid? requestedUserId)
    {
        PagedResult<Announcement> announcements = _announcementRepository.Search(searchText, page, pageSize);
        Announcement[] favoriteAnnouncements = requestedUserId is { } id
            ? _announcementRepository.GetFavoriteAnnouncements(id)
            : Array.Empty<Announcement>();

        AnnouncementShortInfo[] announcementInfo = announcements.Values
            .Select(announcement =>
            {
                Boolean isFavorite = favoriteAnnouncements.Any(a => announcement.Id == a.Id);
                return new AnnouncementShortInfo(announcement, isFavorite);
            })
            .ToArray();

        return new PagedResult<AnnouncementShortInfo>(announcementInfo, announcements.TotalRows);
    }

    public Announcement? GetAnnouncement(Guid announcementId)
    {
        return _announcementRepository.GetAnnouncement(announcementId); 
    }

    public AnnouncementStatistics[] GetAnnouncementsStatistics(Guid[] announcementIds)
    {
        AnnouncementViews[]  views = _announcementRepository.GetAnnouncementViews(announcementIds); 
        AnnouncementMessages[]  messages = _announcementRepository.GetAnnouncementMessages(announcementIds); 
        AnnouncementFavorites[] favorites = _announcementRepository.GetAnnouncementFavorites(announcementIds); 
        
        return announcementIds.Select(announcementId =>
        {
            Int32 viewsCount = views.FirstOrDefault(s => s.AnnouncementId == announcementId)?.Count ?? 0;  
            Int32 favoritesCount = favorites.FirstOrDefault(s => s.AnnouncementId == announcementId)?.Count ?? 0; 
            Int32 messagesCount = messages.FirstOrDefault(s => s.AnnouncementId == announcementId)?.Count ?? 0; 

            return new AnnouncementStatistics(announcementId, viewsCount, favoritesCount, messagesCount); 
        }).ToArray();
    }

    public AnnouncementDetailInfo GetAnnouncementInfo(Guid announcementId, Guid requestedUserId)
    {
        Announcement announcement = _announcementRepository.GetAnnouncement(announcementId).NotNullOrThrow();
        User owner = _usersService.GetUser(announcement.OwnerUserId).NotNullOrThrow();
        AnnouncementCategory category = GetAnnouncementCategory(announcement.CategoryId);
        Boolean isFavorite = GetFavoriteAnnouncement(announcementId, requestedUserId) is not null; 

        return new AnnouncementDetailInfo(announcement, owner, category, isFavorite); 
    }

    public Announcement[] GetAnnouncements(Guid userId)
    {
        return _announcementRepository.GetAnnouncements(userId); 
    }

    public Announcement[] GetAnnouncements(Guid[] announcementIds)
    {
        return _announcementRepository.GetAnnouncements(announcementIds);
    }

    public PagedResult<AnnouncementShortInfo> GetAnnouncementsPageInfo(Guid? userId, Int32 page, Int32 pageSize, Guid? requestedUserId)
    {
        PagedResult<Announcement> announcements = _announcementRepository.GetAnnouncements(userId, page, pageSize);
        
        Announcement[] favoriteAnnouncements = requestedUserId is { } id
            ? _announcementRepository.GetFavoriteAnnouncements(id)
            : Array.Empty<Announcement>();

        AnnouncementShortInfo[] announcementInfo = announcements.Values
            .Select(announcement =>
            {
                Boolean isFavorite = favoriteAnnouncements.Any(a => announcement.Id == a.Id);
                return new AnnouncementShortInfo(announcement, isFavorite);
            })
            .ToArray();

        return new PagedResult<AnnouncementShortInfo>(announcementInfo, announcements.TotalRows);
    }

    public Result RemoveAnnouncement(Guid announcementId, Guid userId)
    {
        _announcementRepository.RemoveAnnouncement(announcementId, userId);
        
        return Result.Success();
    }

    public void ToggleFavoriteAnnouncement(Guid announcementId, Guid userId)
    {
        Announcement? favoriteAnnouncement = GetFavoriteAnnouncement(announcementId, userId);
        Boolean isFavorite = favoriteAnnouncement is not null;

        if (isFavorite)
        {
            RemoveFavoriteAnnouncement(announcementId, userId);
        }
        else
        {
            AddFavoriteAnnouncement(announcementId, userId);
        }
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

    public AnnouncementShortInfo[] GetFavoriteAnnouncementsShortInfo(Guid userId)
    {
        var favoriteAnnouncements = GetFavoriteAnnouncements(userId);
        return favoriteAnnouncements.Select(announcement => new AnnouncementShortInfo(announcement, isFavorite: true)).ToArray();
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