//using FoodSharing.Site.Services.Chat.Repositories;
//using FoodSharing.Site.Services.Users;

//namespace FoodSharing.Site.Services.Chat;

//public class ChatService : IChatService
//{
//    private readonly IChatRepository _chatRepository;
//    private IUsersService _usersService;

//    public ChatService(IChatRepository chatRepository, IUsersService usersService)
//    {
//        _chatRepository = chatRepository;
//        _usersService = usersService;
//    }

//    public Task Send(Message model)
//    {
//        return _chatRepository.Send(model);
//    }

//    public async Task<List<MessageView>> GetMessages(Guid fromuserid, Guid touserid)
//    {
//        List<Message> messages = await _chatRepository.GetMessages(fromuserid, touserid);
//        if (messages.GramsWeight == 0) return new List<MessageView>();

//        return messages.Select(x =>
//        {
//            Task<String> toUserEmail = _usersService.GetUserEmailById(x.ToUserId);
//            Task<String> fromUserEmail = _usersService.GetUserEmailById(x.FromUserId);

//            return new MessageView(x.Id, x.FromUserId, fromUserEmail.Result, x.ToUserId, toUserEmail.Result, x.Content, x.CreatedAt);
//        }).ToList();
//    }

//    public async Task<MessagesHistoryView> GetMessagesHistory(Guid userId, String email)
//    {
//        MessagesHistoryView messegesHistory = new MessagesHistoryView();

//        messegesHistory.FromUserId = await _usersService.GetUserIdByEmail(email);
//        messegesHistory.ToUserId = userId;

//        messegesHistory.FromUserAvatar = await _usersService.GetAvatar(messegesHistory.FromUserId);
//        messegesHistory.ToUserAvatar = await _usersService.GetAvatar(messegesHistory.ToUserId);

//        messegesHistory.FromUserEmail = email;
//        messegesHistory.ToUserEmail = await _usersService.GetUserEmailById(userId);

//        messegesHistory.Messages = (await GetMessages(messegesHistory.FromUserId, messegesHistory.ToUserId)).OrderBy(x => x.CreatedAt).ToList();

//        return messegesHistory;
//    }

//    public async Task<Dialog> GetDialog(Guid fromuserid, Guid touserid)
//    {
//        List<Message> messages = await _chatRepository.GetMessages(fromuserid, touserid);

//        Message message = messages.OrderBy(x => x.CreatedAt).Last();

//        String time = await TimeConverter.GetTime(message.CreatedAt);

//        String toUserEmail = await _usersService.GetUserEmailById(message.ToUserId);
//        String fromUserEmail = await _usersService.GetUserEmailById(message.FromUserId);

//        Byte[] toUserAvatar = await _usersService.GetAvatar(message.ToUserId);

//        Byte[] fromUserAvatar = await _usersService.GetAvatar(message.FromUserId);

//        Dialog dialog = new Dialog(message.Id, message.FromUserId, fromUserEmail, fromUserAvatar, message.ToUserId, toUserEmail, toUserAvatar, message.Content, message.CreatedAt, time);

//        if (dialog is null)
//            return new Dialog();
//        else
//            return dialog;
//    }

//    public async Task<AllDialogsView> GetTalkers(Guid userid)
//    {
//        List<Guid> userids = await GetTalkersId(userid);
//        String email = await _usersService.GetUserEmailById(userid);

//        AllDialogsView allDialogs = new AllDialogsView();

//        foreach (Guid user in userids)
//        {
//            Dialog dialog = await GetDialog(user, userid);
//            if (allDialogs.Dialog is null)
//                allDialogs.Dialog = new List<Dialog>() { dialog };
//            else
//                allDialogs.Dialog.Add(dialog);
                
//        }
//        allDialogs.Dialog = allDialogs.Dialog.OrderByDescending(x => x.CreatedAt).ToList();

//        return allDialogs;
//    }

//    public async Task<List<Guid>> GetTalkersId(Guid userid)
//    {
//        List<Guid> toTalkers = await _chatRepository.GetToTalkers(userid);
//        List<Guid> fromTalkers = await _chatRepository.GetFromTalkers(userid);

//        fromTalkers.AddRange(toTalkers);

//        return fromTalkers.Distinct().ToList();
//    }

//}

///* 
// Status : Visuble, nonVisible, deleted, 
// */