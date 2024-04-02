namespace FoodSharing.Site.Tools.Types;

public abstract class BaseResult
{
    public Error[] Errors { get; }
    public abstract Boolean IsSuccess { get; }

    public String ErrorsAsString => Errors.AsString();

    protected BaseResult(params Error[] errors)
    {
        Errors = errors;
    }

    public override String ToString()
    {
        return IsSuccess
            ? "Успешно"
            : ErrorsAsString;
    }
}
