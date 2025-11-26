namespace Persistence.Services
{
    public class AwsS3Config
    {
        public string Region { get; set; }
        public S3Config S3 { get; set; }
    }

    public class S3Config
    {
        public string AssetsBucketName { get; set; }
    }
}
