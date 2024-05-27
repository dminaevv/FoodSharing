using FoodSharing.Site.Models.Announcements;
using FoodSharing.Site.Services.Announcements.Repositories.Converters;
using FoodSharing.Site.Services.Announcements.Repositories.Models;
using FoodSharing.Site.Tools.Database;
using FoodSharing.Site.Tools.Types;
using Npgsql;
using IConfiguration = FoodSharing.Site.Models.Configurations.IConfiguration;

namespace FoodSharing.Site.Services.Announcements.Repositories;

public class AnnouncementRepository : BaseRepository, IAnnouncementRepository
{
    private readonly IMainConnector _mainConnector;
    private readonly IConfiguration _configuration;

    public AnnouncementRepository(IMainConnector mainConnector, IConfiguration configuration)
    {
        _mainConnector = mainConnector;
        _configuration = configuration;
    }

    #region Announcement

    public void SaveView(AnnouncementView announcementView)
    {
        String expression = @"
        INSERT INTO announcementviews (announcementid, userviewerid, viewingdatetimeutc)
        VALUES (@p_announcementId, @p_userViewerId, @p_viewingDateTimeUtc)
        ON CONFLICT (announcementid, userviewerid) 
        DO UPDATE SET
        viewingdatetimeutc = @p_viewingDateTimeUtc";

        NpgsqlParameter[] parameters =
        {
            new("p_announcementId", announcementView.AnnouncementId),
            new("p_userViewerId", announcementView.UserViewerId),
            new("p_viewingDateTimeUtc", announcementView.ViewingDateTimeUtc),
        };

        _mainConnector.ExecuteNonQuery(expression, parameters);
    }

    public void SaveAnnouncement(AnnouncementBlank.Validated blank, Guid userId)
    {
        String expression = @"
        INSERT INTO announcements
        (
            id, ""name"", owneruserid, description, categoryid, gramsweight, cityId, 
            imagesurls, createduserid, createddatetimeutc,isremoved
        )
        VALUES
        (
            @p_id,  @p_name, @p_ownerUserId, @p_description,  @p_categoryId, @p_gramsWeight,
            @p_cityId, @p_imagesUrls, @p_userId, @p_dateTimeUtcNow, false

        )ON CONFLICT (id)
         DO UPDATE SET
         name = @p_name,
         owneruserid = @p_ownerUserId,
         description = @p_description,
         categoryid = @p_categoryId,
         gramsweight = @p_gramsWeight,
         cityId = @p_cityId,
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
            new("p_cityId", blank.CityId),
            new("p_imagesUrls", blank.ImagesUrls),
            new("p_userId", userId),
            new("p_dateTimeUtcNow", DateTime.UtcNow)
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

        return _mainConnector.Get<AnnouncementDB?>(expression, parameters)?.ToAnnouncement(_configuration.FileStorage_Host);
    }

    public Announcement[] GetAnnouncements(Guid userId)
    {
        String expression = @"SELECT * FROM announcements WHERE owneruserid = @p_ownerUserId AND isremoved = false";

        NpgsqlParameter[] parameters =
        {
            new("p_ownerUserId", userId),
        };

        return _mainConnector.GetList<AnnouncementDB>(expression, parameters)
            .Select(a => a.ToAnnouncement(_configuration.FileStorage_Host))
            .ToArray();
    }

    public Announcement[] GetAnnouncements(Guid[] announcementIds)
    {
        String expression = @"SELECT * FROM announcements WHERE id = ANY(@p_announcementIds)";

        NpgsqlParameter[] parameters =
        {
            new("p_announcementIds", announcementIds),
        };

        return _mainConnector.GetList<AnnouncementDB>(expression, parameters)
            .Select(a => a.ToAnnouncement(_configuration.FileStorage_Host))
            .ToArray();
    }

    public PagedResult<Announcement> Search(String? searchText, Guid? categoryId, Guid? cityId, Int32 page, Int32 pageSize)
    {
        (Int32 offset, Int32 limit) = NormalizeRange(page, pageSize);

        String expression = @"
           SELECT
            (
                 SELECT COUNT(*)  
                 FROM announcements 
                 WHERE (@searchText IS NULL OR (name % @searchText OR description % @searchText))
                AND (@categoryId IS NULL OR categoryid = @categoryId)
                AND (@cityId IS NULL OR cityid = @cityId)
                AND isremoved = false
            ) AS totalRows, 
            sub.*
            FROM (
                SELECT *
                FROM announcements
                WHERE (@searchText IS NULL OR (name % @searchText OR description % @searchText))
                AND (@categoryId IS NULL OR categoryid = @categoryId)
                AND (@cityId IS NULL OR cityid = @cityId)
                AND isremoved = false
                ORDER BY createddatetimeutc
                OFFSET @offset
                LIMIT @limit
            ) AS sub;";

        NpgsqlParameter[] parameters =
        {
            new("searchText", NpgsqlTypes.NpgsqlDbType.Text)
            {
                Value = searchText ?? (Object)DBNull.Value,
                IsNullable = true
            },
            new("categoryId", NpgsqlTypes.NpgsqlDbType.Uuid)
            {
                Value = categoryId ?? (Object)DBNull.Value,
                IsNullable = true
            },
            new("cityId", NpgsqlTypes.NpgsqlDbType.Uuid)
            {
                Value = cityId ?? (Object)DBNull.Value,
                IsNullable = true
            },
            new("offset", offset),
            new("limit", limit)
        };

        Page<AnnouncementDB> pageResult = _mainConnector.GetPage<AnnouncementDB>(expression, parameters);

        Int64 totalRows = pageResult.TotalRows;
        Announcement[] announcements = pageResult.Values.Select(a => a.ToAnnouncement(_configuration.FileStorage_Host)).ToArray();

        return new PagedResult<Announcement>(announcements, totalRows);
    }

    public PagedResult<Announcement> GetAnnouncements(Guid? userId, Int32 page, Int32 pageSize)
    {
        (Int32 offset, Int32 limit) = NormalizeRange(page, pageSize);

        String expression = @"
            SELECT   
            (
                SELECT COUNT(*)  
                FROM announcements 
                WHERE 
                (@p_userId IS NULL OR owneruserid = @p_userId)
                AND isremoved = false
            ) AS totalRows,  sub.*
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
        Announcement[] announcements = pageResult.Values.Select(a => a.ToAnnouncement(_configuration.FileStorage_Host)).ToArray();

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

    public AnnouncementViews[] GetAnnouncementViews(Guid[] announcementIds)
    {
        String expression = @"
                SELECT announcementid, COUNT(userviewerid) AS count
                FROM announcementviews
                WHERE announcementid = ANY (@p_announcementIds) 
                GROUP BY announcementid;";

        NpgsqlParameter[] parameters =
        {
            new("p_announcementIds", announcementIds),
        };

        return _mainConnector.GetList<AnnouncementViews>(expression, parameters).ToArray();
    }

    public AnnouncementMessages[] GetAnnouncementMessages(Guid[] announcementIds)
    {
        String expression = @"
                SELECT announcementid, COUNT(id) AS count
                FROM chats
                WHERE announcementid = ANY (@p_announcementIds) 
                GROUP BY announcementid;";

        NpgsqlParameter[] parameters =
        {
            new("p_announcementIds", announcementIds),
        };

        return _mainConnector.GetList<AnnouncementMessages>(expression, parameters).ToArray();

    }

    public AnnouncementFavorites[] GetAnnouncementFavorites(Guid[] announcementIds)
    {
        String expression = @"
                SELECT announcementid, COUNT(userid) AS count
                FROM favoriteannouncements
                WHERE announcementid = ANY (@p_announcementIds) 
                GROUP BY announcementid;";

        NpgsqlParameter[] parameters =
        {
            new("p_announcementIds", announcementIds),
        };

        return _mainConnector.GetList<AnnouncementFavorites>(expression, parameters).ToArray();
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

        return _mainConnector.Get<AnnouncementDB>(expression, parameters)?.ToAnnouncement(_configuration.FileStorage_Host);
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

        return _mainConnector.GetList<AnnouncementDB>(expression, parameters)
            .Select(a => a.ToAnnouncement(_configuration.FileStorage_Host))
            .ToArray();
    }

    public void RemoveFavoriteAnnouncement(Guid announcementId, Guid userId)
    {
        String expression = @"DELETE FROM favoriteannouncements WHERE announcementId = @p_announcementId AND userid = @p_userId ;";

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