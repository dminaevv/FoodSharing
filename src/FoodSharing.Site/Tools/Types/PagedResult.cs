namespace FoodSharing.Site.Tools.Types;

public class PagedResult<T>
{
    public List<T> Values { get; }
    public Int64 TotalRows { get; }

    public PagedResult(List<T> values, Int64 totalRows)
    {
        Values = values;
        TotalRows = totalRows;
    }

    public PagedResult(IEnumerable<T> values, Int64 totalRows)
    {
        Values = new List<T>(values ?? Array.Empty<T>());
        TotalRows = totalRows;
    }
}