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

    private String SavePhoto(CFile  photo, String directory)
    {
        String filePath = Path.Combine(directory, photo.Name);

        String uploadFolder = Path.Combine(_hostingEnvironment.WebRootPath, filePath);
        if (!Directory.Exists(uploadFolder)) Directory.CreateDirectory(uploadFolder);

        File.WriteAllBytesAsync(uploadFolder, photo.Bytes);

        return filePath;
    }

    private String[] SavePhotos(CFile[] photos, String directory)
    {
        String uploadFolder = Path.Combine(_hostingEnvironment.WebRootPath, directory);
        if (!Directory.Exists(uploadFolder)) Directory.CreateDirectory(uploadFolder);

        String[] filePaths = photos.Select(photo =>
        {
            String filePath = Path.Combine(uploadFolder, photo.Name);
            String shortFilePath = Path.Combine(directory, photo.Name);

            File.WriteAllBytesAsync(filePath, photo.Bytes);

            return shortFilePath;

        }).ToArray();

        return filePaths;
    }

    public String SaveAnnouncementPhoto(CFile photo)
    {
        return SavePhoto(photo, AnnouncementPhotoDirectory); 
    }

    public String[] SaveAnnouncementPhotos(CFile[] photos)
    {
        return SavePhotos(photos, AnnouncementPhotoDirectory);
    }
}
