using FoodSharing.Site.Models.Files;

namespace FoodSharing.Site.Services.Files;

public interface IFileService
{
    String SaveAnnouncementPhoto(CFile photo);
    String[] SaveAnnouncementPhotos(CFile[] photos);

}
