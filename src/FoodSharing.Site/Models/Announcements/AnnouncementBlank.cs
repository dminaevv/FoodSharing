#pragma warning disable CS8618
namespace FoodSharing.Site.Models.Announcements;

public partial class AnnouncementBlank
{
    public Guid? Id { get; set; }
    public String? Name { get; set; }
    public Guid? OwnerUserId { get; set; }
    public String? Description { get; set; }
    public Guid? CategoryId { get; set; }
    public Int32? GramsWeight { get; set; }
    public String[]? ImagesUrls { get; set; }
    public IFormFile[]? UploadPhotos { get; set; }
}

public partial class AnnouncementBlank
{
    public class Validated
    {
        public Guid Id { get; }
        public String Name { get; }
        public Guid OwnerUserId { get; }
        public String Description { get; }
        public Guid CategoryId { get; }
        public Int32 GramsWeight { get; }
        public List<String> ImagesUrls { get; }
        public IFormFile[] UploadPhotos { get;  }
        public Validated(
            Guid id, String name, Guid ownerUserId, String description,
            Guid categoryId, Int32 gramsWeight, String[] imagesUrls, IFormFile[] uploadPhotos)
        {
            Id = id;
            Name = name;
            OwnerUserId = ownerUserId;
            Description = description;
            CategoryId = categoryId;
            GramsWeight = gramsWeight;
            ImagesUrls = imagesUrls.ToList();
            UploadPhotos = uploadPhotos;
        }
    }
}