using FoodSharing.Site.Models.Cities;
using FoodSharing.Site.Services.Cities.Repositories.Converters;
using FoodSharing.Site.Tools.Database;
using Npgsql;
using CityDB = FoodSharing.Site.Services.Cities.Repositories.Models.CityDB;

namespace FoodSharing.Site.Services.Cities.Repositories;

public class CityRepository : ICityRepository
{
    private readonly IMainConnector _mainConnector;

    public CityRepository(IMainConnector mainConnector)
    {
        _mainConnector = mainConnector;
    }

    public City? GetCity(Guid cityId)
    {
        NpgsqlParameter[] parameters =
        {
            new("p_cityId", cityId),
        };

        String expression = @"SELECT * FROM cities WHERE id = @p_cityId";

        return _mainConnector.Get<CityDB>(expression, parameters)?.ToCity();
    }

    public City[] GetCities()
    {
        String expression = @"SELECT * FROM cities";

        return _mainConnector.GetList<CityDB>(expression).Select(c => c.ToCity()).ToArray();
    }

    public City[] GetCities(Guid[] cityIds)
    {
        NpgsqlParameter[] parameters =
        {
            new("p_cityIds", cityIds),
        };

        String expression = @"SELECT * FROM cities WHERE id = ANY(@p_cityIds)";

        return _mainConnector.GetList<CityDB>(expression, parameters).Select(c => c.ToCity()).ToArray();
    }
}