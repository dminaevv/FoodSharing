namespace FoodSharing.Site.Services.Configurations.Repositories.Models;

public class ConfigurationItemDB
{
    public String Key { get; set; }
    public String Value { get; set; }

    public ConfigurationItemDB(String key, String value)
    {
        Key = key;
        Value = value;
    }
}