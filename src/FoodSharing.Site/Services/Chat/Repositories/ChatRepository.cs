//using FoodSharing.Site.Services.Chat.Repositories.Converters;

//namespace FoodSharing.Site.Services.Chat.Repositories;

//public class ChatRepository : IChatRepository
//{
//    private DbConnection _dbConnection;

//    public ChatRepository(IConfiguration config)
//    {
//        _dbConnection = new DbConnection(config.GetConnectionString("DefaultConnection"));
//    }

//    public Task Send (Message model)
//    {
//        String expression = @"INSERT INTO messages (id, fromuserid, touserid, content, createdat) 
//								VALUES (@id, @fromuserid, @touserid, @content, @createdat)";

//        NpgsqlParameter[] parameters = new[]
//        {
//            new NpgsqlParameter(nameof(model.Id), model.Id),
//            new NpgsqlParameter(nameof(model.FromUserId), model.FromUserId),
//            new NpgsqlParameter(nameof(model.ToUserId), model.ToUserId),
//            new NpgsqlParameter(nameof(model.Content), model.Content),
//            new NpgsqlParameter(nameof(model.CreatedAt), model.CreatedAt),
//        };
//        return _dbConnection.Add(expression, parameters);
//    }

//    public Task<List<Message>> GetMessages(Guid fromuserid, Guid touserid)
//    {
//        String expression = @"SELECT * FROM messages WHERE (fromuserid = @fromuserid AND touserid = @touserid) OR (fromuserid = @touserid AND touserid = @fromuserid) ";

//        NpgsqlParameter[] parameters = new[]
//        {
//            new NpgsqlParameter(nameof(fromuserid), fromuserid),
//            new NpgsqlParameter(nameof(touserid), touserid),
//        };
//        return _dbConnection.GetList(expression, ChatConverter.MapToMessages, parameters);
//    }

//    public Task<List<Message>> GetAllMessages(Guid fromuserid)
//    {
//        String expression = @"SELECT * FROM messages WHERE (fromuserid = @fromuserid OR touserid = @fromuserid) ";

//        NpgsqlParameter[] parameters = new[]
//        {
//            new NpgsqlParameter(nameof(fromuserid), fromuserid),
//        };
//        return _dbConnection.GetList(expression, ChatConverter.MapToMessages, parameters);
//    }

//    public Task<List<Guid>> GetTalkers(Guid userid)
//    {
//        String expression = @"SELECT touserid FROM messages WHERE ( fromuserid = @userid OR touserid = @userid ) GROUP BY touserid HAVING touserid <> @userid ";

//        NpgsqlParameter[] parameters = new[]
//        {
//            new NpgsqlParameter(nameof(userid), userid),
//        };

//        return _dbConnection.GetList(expression, ChatConverter.MapToGuid, parameters);
//    }

//    public Task<List<Guid>> GetToTalkers(Guid userid)
//    {
//        String expression = @"SELECT touserid FROM messages WHERE ( fromuserid = @userid OR touserid = @userid ) GROUP BY touserid HAVING touserid <> @userid ";

//        NpgsqlParameter[] parameters = new[]
//        {
//            new NpgsqlParameter(nameof(userid), userid),		
//        };

//        return _dbConnection.GetList(expression, ChatConverter.MapToGuid, parameters);
//    }

//    public Task<List<Guid>> GetFromTalkers(Guid userid)
//    {
//        String expression = @"SELECT fromuserid FROM messages WHERE ( fromuserid = @userid OR touserid = @userid ) GROUP BY fromuserid HAVING fromuserid <> @userid ";

//        NpgsqlParameter[] parameters = new[]
//        {
//            new NpgsqlParameter(nameof(userid), userid),
//        };

//        return _dbConnection.GetList(expression, ChatConverter.MapFromGuid, parameters);
//    }



//}