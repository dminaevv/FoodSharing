using FoodSharing.Site.Models.Cities;
using FoodSharing.Site.Services.Cities;
using Microsoft.AspNetCore.Mvc;

namespace FoodSharing.Site.Controllers.Cities;

public class CitiesController : Controller
{
    private readonly ICityService _cityService;

    public CitiesController(ICityService cityService)
    {
        _cityService = cityService;
    }

    [HttpGet("/cities/get")]
    public City[] Get()
    {
        return _cityService.GetCities();
    }
}