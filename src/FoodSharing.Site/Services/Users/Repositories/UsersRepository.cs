using FoodSharing.Site.Models.Users;
using FoodSharing.Site.Services.Users.Repositories.Converters;
using FoodSharing.Site.Services.Users.Repositories.Models;
using FoodSharing.Site.Tools.Database;
using Npgsql;

namespace FoodSharing.Site.Services.Users.Repositories;

public class UsersRepository : IUsersRepository
{
    private readonly IMainConnector _mainConnector;

    public UsersRepository(IMainConnector mainConnector)
    {
        _mainConnector = mainConnector;
    }

    #region Users

    public void SaveUser(UserBlank.Validated validatedBlank, Guid userId)
    {
        String expression = @"
        INSERT INTO users
        (
            id, email, passwordhash, firstname, lastname,
            phone, avatarurl, createduserid, modifieduserid, 
            createddatetimeutc, modifieddatetimeutc, isremoved
        )
        VALUES
        (
            @p_id,  @p_email, @p_passwordHash, @p_firstName, 
            @p_lastName, @p_address, @p_phone, @p_avatarUrl, 
            @p_userId, null,  @p_dateTimeUtcNow, null, false

        )ON CONFLICT (id)
         DO UPDATE SET
         email = @p_email,
         passwordhash = @p_passwordHash,
         firstname = @p_firstName,
         lastname = @p_lastName,
         phone = @p_phone,
         avatarurl = @p_avatarUrl,
         modifieduserid = @p_userId,
         modifieddatetimeutc = @p_dateTimeUtcNow";

        NpgsqlParameter[] parameters =
        {
            new("p_id", validatedBlank.Id),
            new("p_email", validatedBlank.Email),
            new("p_passwordHash", validatedBlank.PasswordHash),
            new("p_firstName", validatedBlank.FirstName),
            new("p_lastName", validatedBlank.LastName),
            new("p_phone", validatedBlank.Phone),
            new("p_avatarUrl", validatedBlank.AvatarUrl),
            new("p_dateTimeUtcNow", DateTime.UtcNow),
            new("p_userId", userId)
        };

        _mainConnector.ExecuteNonQuery(expression, parameters);
    }

    public void RegisterUser(Guid userId, String email, String passwordHash)
    {
        String expression = @"
        INSERT INTO users
        (
            id, email, passwordhash, createduserid,
            createddatetimeutc, isremoved
        )
        VALUES
        (
            @p_id,  @p_email, @p_passwordHash, 
            @p_id, @p_dateTimeUtcNow, false

        );";

        NpgsqlParameter[] parameters =
        {
            new("p_id", userId),
            new("p_email",email),
            new("p_passwordHash", passwordHash),
            new("p_dateTimeUtcNow", DateTime.UtcNow)
        };

        _mainConnector.ExecuteNonQuery(expression, parameters);
    }

    public User? GetUserByEmail(String email)
    {
        String expression = @"SELECT * FROM users WHERE email = @p_email";

        NpgsqlParameter[] parameters =
        {
            new("p_email", email),
        };

        return _mainConnector.Get<UserDB?>(expression, parameters)?.ToUser();
    }

    public User? GetUser(String email, String passwordHash)
    {
        String expression = @"SELECT * FROM users WHERE email = @p_email AND passwordhash = @p_passwordHash;";

        NpgsqlParameter[] parameters =
        {
            new("p_email", email),
            new("p_passwordHash", passwordHash)
        };

        return _mainConnector.Get<UserDB?>(expression, parameters)?.ToUser();
    }

    public User? GetUser(Guid userId)
    {
        String expression = @"SELECT * FROM users WHERE id = @p_userId";

        NpgsqlParameter[] parameters =
        {
            new("p_userId", userId),
        };

        return _mainConnector.Get<UserDB?>(expression, parameters)?.ToUser();
    }

    public User? GetUserByAnnouncement(Guid announcementId)
    {
        String expression = @"
            SELECT *
            FROM users
            WHERE id = (SELECT owneruserid FROM announcements WHERE id = @p_announcementId);
            ";

        NpgsqlParameter[] parameters =
        {
            new("p_announcementId", announcementId),
        };

        return _mainConnector.Get<UserDB?>(expression, parameters)?.ToUser();
    }

    public User[] GetUsers(Guid[] ids)
    {
        String expression = @"SELECT * FROM users WHERE id = ANY(@p_userIds)";

        NpgsqlParameter[] parameters = new[]
        {
            new NpgsqlParameter("p_userIds", ids),
        };

        return _mainConnector.GetList<UserDB>(expression, parameters).Select(u => u.ToUser()).ToArray();
    }

    #endregion Users

    #region UserTokens

    public void SaveToken(UserToken token)
    {
        String expression = @"
            INSERT INTO tokens (
	                token,
	                userid,
	                expirationdatetimeutc,
	                createddatetimeutc
                )
                VALUES(
	                @p_token,
	                @p_userId,
	                @p_expirationDateTimeUtc,
	                @p_createdDateTimeUtc
                );";

        NpgsqlParameter[] parameters = {
            new("p_token", token.Token),
            new("p_userId", token.UserId),
            new("p_expirationDateTimeUtc", token.ExpirationDateTimeUtc),
            new("p_createdDateTimeUtc", DateTime.UtcNow)
        };

        _mainConnector.ExecuteNonQuery(expression, parameters);
    }

    public UserToken? GetToken(String token)
    {
        String expression = @"SELECT *  FROM tokens WHERE token = @p_token;";

        NpgsqlParameter[] parameters = {
            new("p_token", token),
        };

        return _mainConnector.Get<UserTokenDB?>(expression, parameters)?.ToToken();
    }

    public void RemoveToken(String token)
    {
        String expression = @"DELETE FROM tokens WHERE token = @p_token;";

        NpgsqlParameter[] parameters = {
            new("p_token", token),
        };

        _mainConnector.ExecuteNonQuery(expression, parameters);
    }

    #endregion

}