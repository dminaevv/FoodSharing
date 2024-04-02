using FoodSharing.Site.Tools.Types;
using Npgsql;

namespace FoodSharing.Site.Tools.Database;

public interface IMainConnector
{
    T? Get<T>(String expression, params NpgsqlParameter[] parameters);

    List<T> GetList<T>(String expression, params NpgsqlParameter[] parameters);
    Page<T> GetPage<T>(String expression, params NpgsqlParameter[] parameters);

    void Add(String expression, params NpgsqlParameter[] parameters);

    void ExecuteNonQuery(String expression, params NpgsqlParameter[] parameters);
}