namespace FoodSharing.Site.Tools.Types;

public class CFile
{
    public Byte[] Bytes { get; set; }

    public CFile(Byte[] bytes)
    {
        Bytes = bytes;
    }
}