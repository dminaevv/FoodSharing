using FoodSharing.Site.Models.Announcements;
using FoodSharing.Site.Services.Announcements.Repositories.Converters;
using FoodSharing.Site.Services.Announcements.Repositories.Models;
using FoodSharing.Site.Tools.Database;
using FoodSharing.Site.Tools.Types;
using Npgsql;

namespace FoodSharing.Site.Services.Announcements.Repositories;

public class AnnouncementRepository : BaseRepository, IAnnouncementRepository
{
    private readonly IMainConnector _mainConnector;

    public AnnouncementRepository(IMainConnector mainConnector)
    {
        _mainConnector = mainConnector;
    }

    #region Announcement

    public void SaveAnnouncement(AnnouncementBlank.Validated blank, Guid userId)
    {
        String expression = @"
        INSERT INTO announcements
        (
            id, ""name"", owneruserid, description, categoryid, gramsweight,
            imagesurls, createduserid, createddatetimeutc,isremoved
        )
        VALUES
        (
            @p_id,  @p_name, @p_ownerUserId, @p_description,  @p_categoryId, @p_gramsWeight
            @p_imagesUrls, @p_userId, @p_dateTimeUtcNow, false

        )ON CONFLICT (id)
         DO UPDATE SET
         name = @p_name,
         owneruserid = @p_ownerUserId,
         description = @p_description,
         categoryid = @p_categoryId,
         gramsweight = @p_gramsWeight,
         imagesurls = @p_imagesUrls,
         modifieduserid = @p_userId,
         modifieddatetimeutc = @p_dateTimeUtcNow";

        NpgsqlParameter[] parameters =
        {
            new("p_id", blank.Id),
            new("p_name", blank.Name),
            new("p_ownerUserId", blank.OwnerUserId),
            new("p_description", blank.Description),
            new("p_categoryId", blank.CategoryId),
            new("p_gramsWeight", blank.GramsWeight),
            new("p_imagesUrls", blank.ImagesUrls),
            new("p_userId", userId),
            new("p_dateTimeUtcNow", DateTime.UtcNow),

        };

        _mainConnector.ExecuteNonQuery(expression, parameters);
    }

    public Announcement? GetAnnouncement(Guid announcementId)
    {
        String expression = @"SELECT * FROM announcements WHERE id = @p_id AND isremoved = false";

        NpgsqlParameter[] parameters =
        {
            new("p_id", announcementId),
        };

        return _mainConnector.Get<AnnouncementDB?>(expression, parameters)?.ToAnnouncement();
    }

    public Announcement[] GetAnnouncements(Guid userId)
    {
        String expression = @"SELECT * FROM announcements WHERE owneruserid = @p_ownerUserId AND isremoved = false";

        NpgsqlParameter[] parameters =
        {
            new("p_ownerUserId", userId),
        };

        return _mainConnector.GetList<AnnouncementDB>(expression, parameters).Select(a => a.ToAnnouncement()).ToArray();
    }

    public PagedResult<Announcement> GetAnnouncements(Guid? userId, Int32 page, Int32 pageSize)
    {
        (Int32 offset, Int32 limit) = NormalizeRange(page, pageSize); 

        String expression = @"
            SELECT COUNT(*) OVER() AS totalRows, sub.*
            FROM (
                SELECT *
                FROM announcements 
                WHERE 
                (@p_userId IS NULL OR owneruserid = @p_userId)
                AND isremoved = false
                ORDER BY createddatetimeutc
                OFFSET @offset
                LIMIT @limit
            ) AS sub;";

        NpgsqlParameter[] parameters =
        {
            new("p_userId", NpgsqlTypes.NpgsqlDbType.Uuid)
            {
                Value = userId ?? (Object)DBNull.Value,
                IsNullable = true
            },
            new("offset", offset),
            new("limit", limit)
        };

        Page<AnnouncementDB> pageResult = _mainConnector.GetPage<AnnouncementDB>(expression, parameters);
        
        Int64 totalRows = pageResult.TotalRows;
        Announcement[] announcements = pageResult.Values.Select(a => a.ToAnnouncement()).ToArray();

        return new PagedResult<Announcement>(announcements, totalRows); 
    }

    public void RemoveAnnouncement(Guid announcementId, Guid userId)
    {
        String expression = @"
                UPDATE announcements 
                SET isremoved = true,
                modifieduserid = @p_userId, 
                modifieddatetimeutc = @p_datetimeUtcNow  
                WHERE id = @p_id;";

        NpgsqlParameter[] parameters =
        {
            new("p_id", announcementId),
            new("p_userId", userId),
            new("p_datetimeUtcNow", DateTime.UtcNow),
        };

        _mainConnector.ExecuteNonQuery(expression, parameters);
    }

    #endregion Announcement


    #region FavoriteAnnouncements

    public void AddFavoriteAnnouncement(Guid announcementId, Guid userId)
    {
        String expression = @"INSERT INTO public.favoriteannouncements
            (announcementid, userid, additiondatetimeutc)
            VALUES(
               @p_announcementId, @p_userId, @p_dateTimeUtcNow
            );";

        NpgsqlParameter[] parameters = {
            new("p_announcementId", announcementId),
            new("p_userId", userId),
            new("p_dateTimeUtcNow", DateTime.UtcNow)
        };

        _mainConnector.ExecuteNonQuery(expression, parameters);
    }

    public Announcement? GetFavoriteAnnouncement(Guid announcementId, Guid userId)
    {
        String expression = @"
            SELECT a.*
            FROM announcements a
            INNER JOIN favoriteannouncements fa ON a.id = fa.announcementid
            WHERE fa.userid = @p_userId AND announcementid = @p_announcementId;";

        NpgsqlParameter[] parameters =
        {
            new("p_userId", userId),
            new("p_announcementId", announcementId),
        };

        return _mainConnector.Get<AnnouncementDB>(expression, parameters)?.ToAnnouncement();
    }

    public Announcement[] GetFavoriteAnnouncements(Guid userId)
    {
        String expression = @"
            SELECT a.*
            FROM announcements a
            INNER JOIN favoriteannouncements fa ON a.id = fa.announcementid
            WHERE fa.userid = @p_userId;";

        NpgsqlParameter[] parameters =
        {
            new("p_userId", userId),
        };

        return _mainConnector.Get<AnnouncementDB[]>(expression, parameters).Select(a => a.ToAnnouncement()).ToArray();
    }

    public void RemoveFavoriteAnnouncement(Guid announcementId, Guid userId)
    {
        String expression = @"DELETE FROM favoriteannouncements WHERE announcementId = @p_announcementId AND userid = p_userId ;";

        NpgsqlParameter[] parameters = {
            new("p_announcementId", announcementId),
            new("p_userId", userId)
        };


        _mainConnector.ExecuteNonQuery(expression, parameters);
    }

    #endregion FavoriteAnnouncements

    #region AnnouncementCategory

    public AnnouncementCategory? GetAnnouncementCategory(Guid categoryId)
    {
        String expression = @"SELECT * FROM announcementcategories WHERE id = @p_categoryId";

        NpgsqlParameter[] parameters = {
            new("p_categoryId", categoryId),
        };

        return _mainConnector.Get<AnnouncementCategoryDB>(expression, parameters)?.ToAnnouncementCategory();
    }

    public AnnouncementCategory[] GetAnnouncementCategories()
    {
        String expression = @"SELECT * FROM announcementcategories";

        return _mainConnector.GetList<AnnouncementCategoryDB>(expression).Select(a => a.ToAnnouncementCategory()).ToArray();
    }

    #endregion AnnouncementCategory
}