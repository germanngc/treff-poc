using Amazon.S3;
using Amazon.S3.Model;
using Application.Interfaces.Services;
using Microsoft.Extensions.Options;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Persistence.Services
{
    public class AwsS3Service : IAwsS3Service
    {
        private readonly AwsS3Config _s3Config;
        private readonly IAmazonS3 _s3Client;

        public AwsS3Service(IOptions<AwsS3Config> s3Config, IAmazonS3 s3Client)
        {
            _s3Config = s3Config.Value;
            _s3Client = s3Client;
        }

        public async Task<string> UploadImagesAsync(string base64, string fileName = "")
        {
            var split = base64.Split(',');
            base64 = split.Length > 1 ? split[1] : base64;
            
            if (IsBase64String(base64))
            {
                var bytes = Convert.FromBase64String(base64);
                fileName = await GenerateFileName(fileName, split[0]);
                
                try
                {
                    using (var fileStream = new MemoryStream(bytes))
                    {
                        var contentType = fileName.EndsWith(".svg") ? "image/svg+xml" : "image/png";
                        
                        var putRequest = new PutObjectRequest
                        {
                            BucketName = _s3Config.S3.AssetsBucketName,
                            Key = fileName,
                            InputStream = fileStream,
                            ContentType = contentType
                        };

                        await _s3Client.PutObjectAsync(putRequest);
                    }

                    // Return full S3 URL
                    return $"https://{_s3Config.S3.AssetsBucketName}.s3.{_s3Config.Region}.amazonaws.com/{fileName}";
                }
                catch (Exception ex)
                {
                    throw new Exception($"Error uploading image to S3: {ex.Message}", ex);
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
                var contentType = split.Length > 1 ? split[0].Replace("data:", "").Replace(";base64", "") : "application/octet-stream";
                string ext = Path.GetExtension(fileName);
                fileName = await GenerateFileName(oldFileName, split[0], ext);
                
                try
                {
                    using (var fileStream = new MemoryStream(bytes))
                    {
                        var putRequest = new PutObjectRequest
                        {
                            BucketName = _s3Config.S3.AssetsBucketName,
                            Key = fileName,
                            InputStream = fileStream,
                            ContentType = contentType
                        };

                        await _s3Client.PutObjectAsync(putRequest);
                    }

                    // Return full S3 URL
                    return $"https://{_s3Config.S3.AssetsBucketName}.s3.{_s3Config.Region}.amazonaws.com/{fileName}";
                }
                catch (Exception ex)
                {
                    throw new Exception($"Error uploading file to S3: {ex.Message}", ex);
                }
            }
            
            return base64 == "none.jpg" ? "" : base64;
        }

        public async Task<string> DeleteImagesAsync(string fileName)
        {
            try
            {
                var deleteRequest = new DeleteObjectRequest
                {
                    BucketName = _s3Config.S3.AssetsBucketName,
                    Key = fileName
                };

                await _s3Client.DeleteObjectAsync(deleteRequest);
                return fileName;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deleting file from S3: {ex.Message}", ex);
            }
        }

        private async Task<string> GenerateFileName(string fileName, string headerBase)
        {
            string extension = headerBase.ToUpper().Contains("SVG") ? "svg" : "png";
            string strFileName = DateTime.Now.ToUniversalTime().ToString("yyyyMMdd\\THHmmssfff") + "." + extension;
            
            if (!string.IsNullOrEmpty(fileName) && fileName != "none.jpg")
            {
                await DeleteImagesAsync(fileName);
            }
            
            return strFileName;
        }

        private async Task<string> GenerateFileName(string fileName, string headerBase, string extension)
        {
            string strFileName = DateTime.Now.ToUniversalTime().ToString("yyyyMMdd\\THHmmssfff") + extension;
            
            if (!string.IsNullOrEmpty(fileName) && fileName != "none.jpg")
            {
                await DeleteImagesAsync(fileName);
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
