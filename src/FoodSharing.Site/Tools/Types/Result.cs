namespace FoodSharing.Site.Tools.Types;

public class Result : BaseResult
{
    public override Boolean IsSuccess => !Errors.Any();

    private Result(params Error[] errors) : base(errors) { }

    public static Result Success() => new();

    public static Result Fail(Error error) => new(error);
    public static Result Fail(String error) => new(new Error(error));
    public static Result Fail(IEnumerable<Error> errors) => new(errors.ToArray());

}