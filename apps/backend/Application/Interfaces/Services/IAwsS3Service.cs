using System.Threading.Tasks;

namespace Application.Interfaces.Services
{
    public interface IAwsS3Service
    {
        Task<string> UploadImagesAsync(string base64, string fileName = "");
        Task<string> UploadFileAsync(string base64, string fileName = "", string oldFileName = "");
        Task<string> DeleteImagesAsync(string fileName);
        bool IsBase64String(string base64);
    }
}
