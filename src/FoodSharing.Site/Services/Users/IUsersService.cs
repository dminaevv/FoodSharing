using FoodSharing.Site.Models.Users;
using FoodSharing.Site.Tools.Types;

namespace FoodSharing.Site.Services.Users;

public interface IUsersService
{
    #region Users

    Result SaveUser(UserBlank userBlank, Guid userId);
    Result RegisterUser(String? email, String? password);
    User? GetUser(Guid userId);
    User? GetUserByEmail(String email);
    User? GetUserByToken(String token);
    User? GetUserByAnnouncement(Guid announcementId);
    User[] GetUsers(Guid[] ids);

    UserInfo GetUserInfo(Guid userId);

    #endregion Users

    #region Authenticate

    DataResult<UserToken> Authenticate(String? email, String? password);
    DataResult<User> ValidateUserToken(String token);
    void LogOut(String token);

    #endregion Authenticate

}