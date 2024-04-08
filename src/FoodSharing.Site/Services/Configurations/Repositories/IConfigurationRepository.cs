using FoodSharing.Site.Models.Configurations;

namespace FoodSharing.Site.Services.Configurations.Repositories;

public interface IConfigurationRepository
{
    ConfigurationItem[] GetConfigurationItems();
}
