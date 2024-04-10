using FoodSharing.Site.Models.Configurations;
using FoodSharing.Site.Services.Announcements;
using FoodSharing.Site.Services.Announcements.Repositories;
using FoodSharing.Site.Services.Chat;
using FoodSharing.Site.Services.Chat.Repositories;
using FoodSharing.Site.Services.Configurations;
using FoodSharing.Site.Services.Configurations.Repositories;
using FoodSharing.Site.Services.Files;
using FoodSharing.Site.Services.Users;
using FoodSharing.Site.Services.Users.Repositories;
using FoodSharing.Site.Tools.Database;
using IConfigurationSettings = FoodSharing.Site.Models.Configurations.IConfiguration;
using ConfigurationSettings = FoodSharing.Site.Models.Configurations.Configuration;
using IConfiguration = Microsoft.Extensions.Configuration.IConfiguration;

namespace FoodSharing.Site.Services;

public static class ServicesConfigurator
{
    public static void Initialize(this IServiceCollection services, String environment)
    {
        IConfiguration configuration = new ConfigurationBuilder()
            .AddJsonFile($"appsettings.{environment}.json", optional: false)
            .Build();

        services.AddSingleton<IMainConnector>(new MainConnector(configuration.GetConnectionString("Main")!));

        services.AddSingleton<IConfigurationSettings, ConfigurationSettings>();

        #region Services

        services.AddSingleton<IFileService, FileService>();
        services.AddSingleton<IUsersService, UsersService>();
        services.AddSingleton<IAnnouncementService, AnnouncementService>();
        services.AddSingleton<IConfigurationService, ConfigurationService>();
        services.AddSingleton<IChatService, ChatService>();

        #endregion Services

        #region Repositories

        services.AddSingleton<IConfigurationRepository, ConfigurationRepository>();
        services.AddSingleton<IUsersRepository, UsersRepository>();
        services.AddSingleton<IAnnouncementRepository, AnnouncementRepository>();
        services.AddSingleton<IChatRepository, ChatRepository>();

        #endregion Repositories

    }
}