using FoodSharing.Site.Models.Cities;

namespace FoodSharing.Site.Services.Cities.Repositories;

public interface ICityRepository
{
    City? GetCity(Guid cityId);
    City[] GetCities();
    City[] GetCities(Guid[] cityIds);

}