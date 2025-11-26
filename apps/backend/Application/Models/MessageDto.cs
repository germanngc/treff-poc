using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Models
{
    public class MessageDto
    {
        public int MessageId { get; set; }
        public int? ParentMessageId { get; set; }
        public int FreelancerId { get; set; }
        public int UserId { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public DateTime SentDateTime { get; set; }
        public List<AttachmentDto> Attachments { get; set; }
    }

    public class AttachmentDto
    {
        public string FileName { get; set; }
        public string Url { get; set; }
    }
}
