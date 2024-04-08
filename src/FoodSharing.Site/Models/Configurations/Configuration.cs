using FoodSharing.Site.Services.Configurations;

namespace FoodSharing.Site.Models.Configurations;

public class Configuration : IConfiguration
{
    public Dictionary<String, String> Configurations { get; }

    public String Company_Name => Get(byKey: "Company_Name");
    public String Company_Domain => Get(byKey: "Company_Domain");
    public String FileStorage_Host => Get(byKey: "FileStorage_Host");


    public Configuration(IConfigurationService configurationService)
    {
        Configurations = configurationService.GetConfigurationItems().ToDictionary(c => c.Key, c => c.Value);
    }

    public String Get(String byKey)
    {
        Boolean containsKey = Configurations.ContainsKey(byKey);
        if (!containsKey) throw new Exception($"Значение для ключа {byKey} не найдено");

        return Configurations[byKey];
    }
}

public interface IConfiguration
{
    String Company_Name { get; }
    String Company_Domain { get; }
    String FileStorage_Host { get; }
}