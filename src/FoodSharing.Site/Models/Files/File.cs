namespace FoodSharing.Site.Models.Files;

public class CFile
{
    public String Name { get; }
    public Byte[] Bytes { get;}

    public CFile(String name, Byte[] bytes)
    {
        Name = name;
        Bytes = bytes;
    }
}
