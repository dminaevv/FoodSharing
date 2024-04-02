namespace FoodSharing.Site.Tools.Types;

public class Page<T>
{
    public List<T> Values { get; set; }
    public Int64 TotalRows { get; set; }
}