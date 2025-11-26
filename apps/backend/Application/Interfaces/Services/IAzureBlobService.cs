using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Services
{
    public interface IAzureBlobService
    {
        Task<string> UploadImagesAsync(string base64, string fileName = "");
        Task<string> UploadFileAsync(string base64, string fileName = "", string oldFileName = "");
        Task<string> DeleteImagesAsync(string fileName);
        bool IsBase64String(string base64);
    }
}
