namespace FoodSharing.Site.Models.Configurations;

public class ConfigurationItem
{
    public String Key { get; set; }
    public String Value { get; set; }

    public ConfigurationItem(String key, String value)
    {
        Key = key;
        Value = value;
    }
}