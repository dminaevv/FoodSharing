using FoodSharing.Site.Models.Users;

namespace FoodSharing.Site.Services.Users.Repositories;

public interface IUsersRepository
{
    #region Users

    void SaveUser(UserBlank.Validated validatedBlank, Guid userId);
    void RegisterUser(Guid userId, String email, String passwordHash);
    User? GetUserByEmail(String email);
    User? GetUser(String email, String passwordHash);
    User? GetUser(Guid userId);
    User[] GetUsers(Guid[] ids);

    #endregion Users

    #region UserTokens

    void SaveToken(UserToken token);
    UserToken? GetToken(String token);
    void RemoveToken(String token);

    #endregion
}