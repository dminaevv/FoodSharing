using FoodSharing.Site.Models.Users;
using FoodSharing.Site.Services.Users.Repositories;
using FoodSharing.Site.Tools.Extensions;
using FoodSharing.Site.Tools.Types;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace FoodSharing.Site.Services.Users;

public class UsersService : IUsersService
{
    private readonly IUsersRepository _usersRepository;

    public UsersService(IUsersRepository usersRepository)
    {
        _usersRepository = usersRepository;
    }

    #region Users

    public Result SaveUser(UserBlank userBlank, Guid userId)
    {
        userBlank.Id ??= Guid.NewGuid();

        Result validateUserResult = ValidateUserBlank(userBlank, out UserBlank.Validated validated);
        if (!validateUserResult.IsSuccess) return Result.Fail(validateUserResult.Errors);

        _usersRepository.SaveUser(validated, userId);

        return Result.Success();
    }

    private Result ValidateUserBlank(UserBlank blank, out UserBlank.Validated validated)
    {
        validated = null!;

        if (blank.Id is not { } id) throw new Exception("Id null при сохранении пользователя");

        User? existUser = GetUser(id);
        Boolean isCreation = existUser is null;

        if (blank.Email.IsNullOrWhitespace()) return Result.Fail("Укажите email");
        if ((isCreation || blank.IsPasswordWasChanged) && blank.Password.IsNullOrWhitespace()) return Result.Fail("Укажите пароль");

        Result validateEmailResult = ValidateEmail(blank.Email);
        if (!validateEmailResult.IsSuccess) return Result.Fail(validateEmailResult.Errors);


        String passwordHash = (isCreation || blank.IsPasswordWasChanged)
            ? GetPasswordHash(blank.Password!)
            : existUser?.PasswordHash!;

        validated = new(
            id, blank.Email, passwordHash, blank.FirstName, blank.LastName, blank.Phone, blank.AvatarUrl
        );

        return Result.Success();
    }

    public Result RegisterUser(String? email, String? password)
    {
        if (email.IsNullOrWhitespace()) return Result.Fail("Укажите email");
        if (password.IsNullOrWhitespace()) return Result.Fail("Укажите пароль");

        Result validateEmailResult = ValidateEmail(email);
        if (!validateEmailResult.IsSuccess) return Result.Fail(validateEmailResult.Errors);

        User? existUser = GetUserByEmail(email);
        if (existUser is not null) return Result.Fail("Пользователь с такой почтой уже зарегистрирован");

        String passwordHash = GetPasswordHash(password);

        Guid newUserId = Guid.NewGuid();
        _usersRepository.RegisterUser(newUserId, email, passwordHash);

        return Result.Success();
    }

    private Result ValidateEmail(String email)
    {
        String validEmailLetters = @"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$";
        if (!Regex.IsMatch(email, validEmailLetters)) return Result.Fail("Укажите корректный email");

        return Result.Success();
    }

    private String GetPasswordHash(String password)
    {
        Byte[] bytes = Encoding.Unicode.GetBytes(password);
        MD5 md5 = MD5.Create();

        Byte[] byteHash = md5.ComputeHash(bytes);
        String hash = Convert.ToHexString(byteHash);

        return hash;
    }

    public User? GetUser(Guid userId)
    {
        return _usersRepository.GetUser(userId);
    }

    public User? GetUserByEmail(String email)
    {
        return _usersRepository.GetUserByEmail(email);
    }

    public User? GetUserByToken(String token)
    {
        UserToken? userToken = GetToken(token);
        if (userToken is null) return null;

        DateTimeOffset utcNow = DateTime.UtcNow;
        Boolean isExpired = userToken.ExpirationDateTimeUtc < utcNow;
        if (isExpired) return null;

        return GetUser(userToken.UserId);
    }

    public User? GetUserByAnnouncement(Guid announcementId)
    {
        return _usersRepository.GetUserByAnnouncement(announcementId);
    }

    public User[] GetUsers(Guid[] ids)
    {
        return _usersRepository.GetUsers(ids);
    }

    public UserInfo GetUserInfo(Guid userId)
    {
        User? user = GetUser(userId);
        if (user is null) throw new Exception("Пользотваель null при получении GetUserInfo");

        return new UserInfo(
            user.Id, user.Email, user.FirstName,
            user.LastName, user.Phone, user.AvatarUrl, user.RegistrationDate
        );
    }

    #endregion Users

    #region Authenticate

    public DataResult<UserToken> Authenticate(String? email, String? password)
    {
        if (email.IsNullOrWhitespace()) return DataResult<UserToken>.Fail("Укажите почту");
        if (password.IsNullOrWhitespace()) return DataResult<UserToken>.Fail("Укажите пароль");

        User? user = _usersRepository.GetUser(email, GetPasswordHash(password));
        if (user is null) return DataResult<UserToken>.Fail("Указана некорректная почта или пароль");

        UserToken token = UserToken.New(user.Id);
        SaveToken(token);

        return DataResult<UserToken>.Success(token);
    }

    public DataResult<User> ValidateUserToken(String token)
    {
        User? user = GetUserByToken(token);
        if (user is null) return DataResult<User>.Fail("Пользователь не авторизован");

        return DataResult<User>.Success(user);
    }

    public void LogOut(String token)
    {
        _usersRepository.RemoveToken(token);
    }

    #endregion Authenticate

    #region UserTokens

    public void SaveToken(UserToken token)
    {
        _usersRepository.SaveToken(token);
    }

    public UserToken? GetToken(String token)
    {
        return _usersRepository.GetToken(token);
    }

    #endregion
}