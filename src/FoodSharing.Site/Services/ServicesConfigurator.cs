using FoodSharing.Site.Services.Announcements;
using FoodSharing.Site.Services.Announcements.Repositories;
using FoodSharing.Site.Services.Users;
using FoodSharing.Site.Services.Users.Repositories;
using FoodSharing.Site.Tools.Database;

namespace FoodSharing.Site.Services;

public static class ServicesConfigurator
{
    public static void Initialize(this IServiceCollection services, String environment)
    {
        IConfiguration configuration = new ConfigurationBuilder()
            .AddJsonFile($"appsettings.{environment}.json", optional: false)
            .Build();

        services.AddSingleton<IMainConnector>(new MainConnector(configuration.GetConnectionString("Main")!));

        #region Services

        services.AddSingleton<IUsersService, UsersService>();
        services.AddSingleton<IAnnouncementService, AnnouncementService>();
        //services.AddSingleton<IChatService, ChatService>();

        #endregion Services

        #region Repositories

        services.AddSingleton<IUsersRepository, UsersRepository>();
        services.AddSingleton<IAnnouncementRepository, AnnouncementRepository>();
        //services.AddSingleton<IChatRepository, ChatRepository>();

        #endregion Repositories

    }
}