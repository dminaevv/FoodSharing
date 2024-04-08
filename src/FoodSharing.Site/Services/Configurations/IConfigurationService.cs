using FoodSharing.Site.Models.Configurations;

namespace FoodSharing.Site.Services.Configurations;

public interface IConfigurationService
{
    ConfigurationItem[] GetConfigurationItems(); 
}