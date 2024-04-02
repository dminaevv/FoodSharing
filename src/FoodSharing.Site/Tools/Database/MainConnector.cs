using Dapper;
using FoodSharing.Site.Tools.Types;
using Npgsql;

namespace FoodSharing.Site.Tools.Database;

public class MainConnector: IMainConnector
{
    private readonly String _connectionString;

    public MainConnector(String connectionString)
    {
        _connectionString = connectionString;
    }

    public T? Get<T>(String expression, params NpgsqlParameter[] parameters)
    {
        DynamicParameters dynamicParameters = new();
        foreach (NpgsqlParameter parameter in parameters)
        {
            dynamicParameters.Add(parameter.ParameterName, parameter.Value, parameter.DbType, parameter.Direction, parameter.Size);
        }

        return InConnection(connection => connection.QueryFirstOrDefault<T>(expression, dynamicParameters));
    }

    public List<T> GetList<T>(String expression, params NpgsqlParameter[] parameters)
    {
        DynamicParameters dynamicParameters = new();
        foreach (NpgsqlParameter parameter in parameters)
        {
            dynamicParameters.Add(parameter.ParameterName, parameter.Value, parameter.DbType, parameter.Direction, parameter.Size);
        }

        return InConnection(connection => connection.Query<T>(expression, dynamicParameters).ToList());
    }

    public Page<T> GetPage<T>(String expression, params NpgsqlParameter[] parameters)
    {
        DynamicParameters dynamicParameters = new();
        foreach (NpgsqlParameter parameter in parameters)
        {
            dynamicParameters.Add(parameter.ParameterName, parameter.Value, parameter.DbType, parameter.Direction, parameter.Size);
        }

        return InConnection(connection =>
        {
            Int32 totalRows = connection.QueryFirstOrDefault<Int32>(expression, dynamicParameters);
            List<T> values = connection.Query<T>(expression, dynamicParameters).ToList();

            return new Page<T>() { TotalRows = totalRows, Values = values };
        });
    }
    public void Add(String expression, params NpgsqlParameter[] parameters)
    {
        InConnection(connection =>
        {
            using NpgsqlCommand command = new(expression, connection);

            foreach (NpgsqlParameter parameter in parameters)
            {
                command.Parameters.AddWithValue(parameter.ParameterName, parameter.Value ?? DBNull.Value);
            }

            command.ExecuteNonQuery();
        });
    }

    public void ExecuteNonQuery(String expression, params NpgsqlParameter[] parameters)
    {
        InConnection(connection =>
        {
            using NpgsqlCommand command = new(expression, connection);

            foreach (NpgsqlParameter parameter in parameters)
            {
                command.Parameters.AddWithValue(parameter.ParameterName, parameter.Value ?? DBNull.Value);
            }

            command.ExecuteNonQuery();
        });
    }


    private T InConnection<T>(Func<NpgsqlConnection, T> func)
    {
        using NpgsqlConnection connection = new(_connectionString);
        try
        {
            connection.Open();
            return func(connection);
        }
        finally
        {
            connection.CloseAsync();
            connection.DisposeAsync();
        }
    }

    private void InConnection(Action<NpgsqlConnection> action)
    {
        using NpgsqlConnection connection = new(_connectionString);
        try
        {
            connection.Open();
            action(connection);
        }
        finally
        {
            connection.CloseAsync();
            connection.DisposeAsync();
        }
    }

}