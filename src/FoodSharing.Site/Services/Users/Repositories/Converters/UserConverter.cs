using FoodSharing.Site.Models.Users;
using FoodSharing.Site.Services.Users.Repositories.Models;

namespace FoodSharing.Site.Services.Users.Repositories.Converters;

public static class UserConverter
{
    public static User ToUser(this UserDB db, String fileStorageHost)
    {
        String? avatarUrl = db.AvatarUrl is not null ? fileStorageHost + db.AvatarUrl : null; 

        return new User(
            db.Id, db.Email, db.PasswordHash, db.FirstName, db.LastName,
            db.Phone, avatarUrl, db.CreatedDateTimeUtc
        ); 
    }

    public static UserToken ToToken(this UserTokenDB db)
    {
        return new UserToken(
            db.Token, db.UserId, db.ExpirationDateTimeUtc
        );
    }
}