using FoodSharing.Site.Models.Files; 

namespace FoodSharing.Site.Services.Files; 

public class FileService: IFileService
{
    private const String PhotoDirectory = "Img";
    private const String AnnouncementPhotoDirectory = $"{PhotoDirectory}\\Announcements";
    private const String UsersPhotoDirectory = $"{PhotoDirectory}\\Users";
    private const String FeedBackPhotoDirectory = $"{PhotoDirectory}\\FeedBacks";

    private readonly IWebHostEnvironment _hostingEnvironment;

    public FileService(IWebHostEnvironment hostingEnvironment)
    {
        _hostingEnvironment = hostingEnvironment;
    }

    private String SavePhoto(CFile photo, String directory)
    {
        String uploadFolder = Path.Combine(_hostingEnvironment.WebRootPath, directory);
        if (!Directory.Exists(uploadFolder)) Directory.CreateDirectory(uploadFolder);

        String filePath = Path.Combine(uploadFolder, photo.Name);
        String shortFilePath = Path.Combine(directory, photo.Name);
        
        File.WriteAllBytes(filePath, photo.Bytes);

        return shortFilePath;
    }

    private String[] SavePhotos(CFile[] photos, String directory)
    {
        String uploadFolder = Path.Combine(_hostingEnvironment.WebRootPath, directory);
        if (!Directory.Exists(uploadFolder)) Directory.CreateDirectory(uploadFolder);

        String[] filePaths = photos.Select(photo =>
        {
            String filePath = Path.Combine(uploadFolder, photo.Name);
            String shortFilePath = Path.Combine(directory, photo.Name);

            File.WriteAllBytes(filePath, photo.Bytes);

            return shortFilePath;

        }).ToArray();

        return filePaths;
    }

    public String SaveAnnouncementPhoto(CFile photo)
    {
        return SavePhoto(photo, AnnouncementPhotoDirectory); 
    }

    public String SaveProfilePhoto(CFile photo)
    {
        return SavePhoto(photo, UsersPhotoDirectory);
    }

    public String[] SaveAnnouncementPhotos(CFile[] photos)
    {
        return SavePhotos(photos, AnnouncementPhotoDirectory);
    }

    public void DeleteProfilePhoto(String photoUrl)
    {
        String filePath = Path.Combine(_hostingEnvironment.WebRootPath, photoUrl);

        if(File.Exists(filePath)) File.Delete(filePath);
    }
}
