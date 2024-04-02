using FoodSharing.Site.Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace FoodSharing.Site.Controllers.Home;

public class HomeController : BaseController
{
    
    [HttpGet("/")]
    public IActionResult Index()
    {
        return ReactApp();
    }
}