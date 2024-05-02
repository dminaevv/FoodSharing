using FoodSharing.Site.Models.Files;

namespace FoodSharing.Site.Services.Files;

public interface IFileService
{
    String SaveProfilePhoto(CFile photo);
    String SaveAnnouncementPhoto(CFile photo);
    String[] SaveAnnouncementPhotos(CFile[] photos);

    void DeleteProfilePhoto(String photoUrl);

}
