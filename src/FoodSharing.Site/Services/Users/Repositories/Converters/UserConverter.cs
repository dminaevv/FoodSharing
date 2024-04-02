using FoodSharing.Site.Models.Users;
using FoodSharing.Site.Services.Users.Repositories.Models;

namespace FoodSharing.Site.Services.Users.Repositories.Converters;

public static class UserConverter
{
    public static User ToUser(this UserDB db)
    {
        return new User(
            db.Id, db.Email, db.PasswordHash, db.FirstName, db.LastName,
            db.Phone, db.AvatarUrl, db.CreatedDateTimeUtc
        ); 
    }

    public static UserToken ToToken(this UserTokenDB db)
    {
        return new UserToken(
            db.Token, db.UserId, db.ExpirationDateTimeUtc
        );
    }
}