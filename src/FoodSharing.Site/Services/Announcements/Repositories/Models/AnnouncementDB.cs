namespace FoodSharing.Site.Services.Announcements.Repositories.Models;

public class AnnouncementDB
{
    public Guid Id   { get; set; }
    public String Name   { get; set; }
    public Guid OwnerUserId  { get; set; }
    public String Description   { get; set; }
    public Guid CategoryId   { get; set; }
    public String GramsWeight   { get; set; }
    public String Address   { get; set; }
    public String[] ImagesUrls   { get; set; }
    public Guid CreatedUserId  { get; set; }
    public Guid? ModifiedUserId  { get; set; }
    public DateTime CreatedDateTimeUtc  { get; set; }
    public DateTime? ModifiedDateTimeUtc  { get; set; }
    public Boolean IsRemoved  { get; set; }
}