using System.Diagnostics.CodeAnalysis;

namespace FoodSharing.Site.Tools.Types;

public class DataResult<T> : BaseResult
{
    public T? Data { get; }

    [MemberNotNullWhen(true, nameof(Data))]
    public override Boolean IsSuccess => !Errors.Any();

    private DataResult(T data)
    {
        Data = data;
    }

    private DataResult(IEnumerable<Error> errors) : base(errors.ToArray())
    {
        Data = default;
    }

    public static DataResult<T> Success(T data) => new(data);

    public static DataResult<T> Fail(IEnumerable<Error> errors) => new(errors);
    public static DataResult<T> Fail(String error) => new(new List<Error>(){ new(error) });
}