using FoodSharing.Site.Models.Cities;

namespace FoodSharing.Site.Services.Cities;

public interface ICityService
{
    City? GetCity(Guid city);
    City[] GetCities();
    City[] GetCities(Guid[] cityIds);
}