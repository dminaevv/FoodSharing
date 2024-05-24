using FoodSharing.Site.Models.Cities;
using FoodSharing.Site.Services.Cities.Repositories;

namespace FoodSharing.Site.Services.Cities;

public class CityService : ICityService
{
    private readonly ICityRepository _cityRepository;

    public CityService(ICityRepository cityRepository)
    {
        _cityRepository = cityRepository;
    }

    public City? GetCity(Guid cityId)
    {
        return _cityRepository.GetCity(cityId);
    }

    public City[] GetCities()
    {
        return _cityRepository.GetCities();
    }

    public City[] GetCities(Guid[] cityIds)
    {
        return _cityRepository.GetCities(cityIds);
    }
}