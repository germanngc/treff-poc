using Application.Interfaces.Services;
using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using MAD.Infrastructure.Services;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class AzureBlobService : IAzureBlobService
    {
        string _accessKey = string.Empty;
        private readonly AzureStorageConfig _storageConfig = null;

        public AzureBlobService(IOptions<AzureStorageConfig> storageConfig)
        {
            _storageConfig = storageConfig.Value;
        }
        public async Task<string> UploadImagesAsync(string base64, string fileName = "")
        {
            var split = base64.Split(',');
            base64 = split.Length > 1 ? split[1] : base64;
            if (IsBase64String(base64))
            {
                var bytes = Convert.FromBase64String(base64);
                var fileStream = new MemoryStream(bytes);
                fileName = await GenerateFileName(fileName, split[0]);
                try
                {
                    // Create a URI to the blob
                    Uri blobUri = new Uri("https://" +
                                          _storageConfig.AccountName +
                                          ".blob.core.windows.net/" +
                                          _storageConfig.ImageContainer +
                                          "/" + fileName);

                    // Create StorageSharedKeyCredentials object by reading
                    // the values from the configuration (appsettings.json)
                    StorageSharedKeyCredential storageCredentials =
                        new StorageSharedKeyCredential(_storageConfig.AccountName, _storageConfig.AccountKey);

                    // Create the blob client.
                    BlobClient blobClient = new BlobClient(blobUri, storageCredentials);
                    // Upload the file
                    var options = new BlobUploadOptions();
                    options.HttpHeaders = new BlobHttpHeaders();
                    if (fileName.EndsWith(".svg"))
                    {
                        options.HttpHeaders.ContentType = "image/svg+xml";
                    }
                    else
                    {
                        options.HttpHeaders.ContentType = "image/png";
                    }
                    await blobClient.UploadAsync(fileStream, options);

                    return fileName;
                }
                catch (Exception ex)
                {
                    throw (ex);
                }
            }
            return base64 == "none.jpg" ? "" : base64;
        }

        public async Task<string> UploadFileAsync(string base64, string fileName = "", string oldFileName = "")
        {
            var split = base64.Split(',');
            base64 = split.Length > 1 ? split[1] : base64;
            if (IsBase64String(base64))
            {
                var bytes = Convert.FromBase64String(base64);
                var fileStream = new MemoryStream(bytes);
                var contentType = split.Length > 1 ? split[0].Replace("data:", "").Replace(";base64", "") : "";
                string ext = Path.GetExtension(fileName);
                fileName = await GenerateFileName(oldFileName, split[0], ext);
                try
                {
                    // Create a URI to the blob
                    Uri blobUri = new Uri("https://" +
                                          _storageConfig.AccountName +
                                          ".blob.core.windows.net/" +
                                          _storageConfig.ImageContainer +
                                          "/" + fileName);

                    // Create StorageSharedKeyCredentials object by reading
                    // the values from the configuration (appsettings.json)
                    StorageSharedKeyCredential storageCredentials =
                        new StorageSharedKeyCredential(_storageConfig.AccountName, _storageConfig.AccountKey);

                    // Create the blob client.
                    BlobClient blobClient = new BlobClient(blobUri, storageCredentials);
                    // Upload the file
                    var options = new BlobUploadOptions();
                    options.HttpHeaders = new BlobHttpHeaders();
                    options.HttpHeaders.ContentType = contentType;

                    await blobClient.UploadAsync(fileStream, options);

                    return fileName;
                }
                catch (Exception ex)
                {
                    throw (ex);
                }
            }
            return base64 == "none.jpg" ? "" : base64;
        }

        public async Task<string> DeleteImagesAsync(string fileName)
        {
            try
            {
                // Create a URI to the blob
                Uri blobUri = new Uri("https://" +
                                      _storageConfig.AccountName +
                                      ".blob.core.windows.net/" +
                                      _storageConfig.ImageContainer +
                                      "/" + fileName);

                // Create StorageSharedKeyCredentials object by reading
                // the values from the configuration (appsettings.json)
                StorageSharedKeyCredential storageCredentials =
                    new StorageSharedKeyCredential(_storageConfig.AccountName, _storageConfig.AccountKey);

                // Create the blob client.
                BlobClient blobClient = new BlobClient(blobUri, storageCredentials);

                // Upload the file
                await blobClient.DeleteIfExistsAsync();

                return fileName;
            }
            catch (Exception ex)
            {
                throw (ex);
            }
        }
        private async Task<string> GenerateFileName(string fileName, string headerBase)
        {
            string extension = headerBase.ToUpper().Contains("SVG") ? "svg" : "png";
            string strFileName = DateTime.Now.ToUniversalTime().ToString("yyyyMMdd\\THHmmssfff") + "." + extension;
            if (!string.IsNullOrEmpty(fileName) && fileName != "none.jpg")
            {
                DeleteImagesAsync(fileName);
            }
            return strFileName;
        }

        private async Task<string> GenerateFileName(string fileName, string headerBase, string extension)
        {
            string strFileName = DateTime.Now.ToUniversalTime().ToString("yyyyMMdd\\THHmmssfff") + extension;
            if (!string.IsNullOrEmpty(fileName) && fileName != "none.jpg")
            {
                DeleteImagesAsync(fileName);
            }
            return strFileName;
        }

        public bool IsBase64String(string base64)
        {
            if (string.IsNullOrEmpty(base64))
            {
                return false;
            }
            Span<byte> buffer = new Span<byte>(new byte[base64.Length]);
            return Convert.TryFromBase64String(base64, buffer, out int bytesParsed);
        }
    }
}
