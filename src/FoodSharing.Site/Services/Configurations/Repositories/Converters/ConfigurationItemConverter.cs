using FoodSharing.Site.Models.Configurations;
using FoodSharing.Site.Services.Configurations.Repositories.Models;

namespace FoodSharing.Site.Services.Configurations.Repositories.Converters;

public static class ConfigurationItemConverter
{
    public static ConfigurationItem ToConfigurationItem(this ConfigurationItemDB configurationItemDb)
    {
        return new ConfigurationItem(configurationItemDb.Key, configurationItemDb.Value);
    }
}