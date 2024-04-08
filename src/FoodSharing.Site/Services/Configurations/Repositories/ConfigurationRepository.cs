using FoodSharing.Site.Models.Configurations;
using FoodSharing.Site.Services.Configurations.Repositories.Converters;
using FoodSharing.Site.Services.Configurations.Repositories.Models;
using FoodSharing.Site.Tools.Database;

namespace FoodSharing.Site.Services.Configurations.Repositories;

public class ConfigurationRepository : IConfigurationRepository
{
    private readonly IMainConnector _mainConnector;

    public ConfigurationRepository(IMainConnector mainConnector)
    {
        _mainConnector = mainConnector;
    }

    public ConfigurationItem[] GetConfigurationItems()
    {
        String query = "SELECT * FROM configurationsettings";

        return _mainConnector.GetList<ConfigurationItemDB>(query)
            .Select(c => c.ToConfigurationItem())
            .ToArray();
    }
}
