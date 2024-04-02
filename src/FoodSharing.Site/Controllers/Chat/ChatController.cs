//using FoodSharing.Site.Services.Chat;
//using FoodSharing.Site.Services.Users;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;

//namespace FoodSharing.Site.Controllers;

//[Authorize]
//public class ChatController : Controller
//{
//    private IChatService _chatService;
//    private IUsersService _usersService;

//    public ChatController(IChatService chatService, IUsersService usersService)
//    {
//        _chatService = chatService;
//        _usersService = usersService;
//    }

//    public IActionResult Index()
//    {
//        return View();
//    }

//    [HttpGet]
//    public async Task<IActionResult> ChatMessage(Guid userId)
//    {
//        if (userId == Guid.Empty) return View();

//        MessagesHistoryView messegesHistory = await _chatService.GetMessagesHistory(userId, User.Identity.Name);

//        return View(messegesHistory);
//    }

//    public async Task<IActionResult> ChatUsers()
//    {           
//        Guid UserId = await _usersService.GetUserIdByEmail(User.Identity.Name);

//        AllDialogsView messages = await _chatService.GetTalkers(UserId);
//        messages.User = User.Identity.Name;

//        return View(messages);
//    }


//}