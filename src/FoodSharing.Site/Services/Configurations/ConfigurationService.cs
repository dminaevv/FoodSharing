using FoodSharing.Site.Models.Configurations;
using FoodSharing.Site.Services.Configurations.Repositories;

namespace FoodSharing.Site.Services.Configurations;

public class ConfigurationService: IConfigurationService
{
    private readonly IConfigurationRepository _configurationRepository;

    public ConfigurationService(IConfigurationRepository configurationRepository)
    {
        _configurationRepository = configurationRepository;
    }

    public ConfigurationItem[] GetConfigurationItems()
    {
        return _configurationRepository.GetConfigurationItems();
    }
}