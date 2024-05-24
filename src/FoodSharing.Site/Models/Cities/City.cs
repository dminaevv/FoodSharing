namespace FoodSharing.Site.Models.Cities;

public class City
{
    public Guid Id { get; }
    public String Name { get; }

    public City(Guid id, String name)
    {
        Id = id;
        Name = name;
    }
}