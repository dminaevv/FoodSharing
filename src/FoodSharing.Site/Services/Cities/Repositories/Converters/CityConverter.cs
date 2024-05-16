using FoodSharing.Site.Models.Cities;
using FoodSharing.Site.Services.Cities.Repositories.Models;

namespace FoodSharing.Site.Services.Cities.Repositories.Converters;

public static class CityConverter
{
    public static City ToCity(this CityDB db)
    {
        return new City(db.Id, db.Name);
    }
}