using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Domain.Entities
{
    [Table("Messages")]
    public class Message
    {
        [Key]
        public int MessageId { get; set; }

        public int? ParentMessageId { get; set; }

        [ForeignKey("Freelancer")]
        public int FreelancerId { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }

        public string Subject { get; set; }

        public string Body { get; set; }

        public DateTime SentDateTime { get; set; }

        public ICollection<Attachment> Attachments { get; set; }

        // Navigation properties
        public virtual Freelancer Freelancer { get; set; }

        public virtual Freelancer User { get; set; }

        [ForeignKey("ParentMessageId")]
        public virtual Message ParentMessage { get; set; }

        public virtual ICollection<Message> Replies { get; set; }
    }
}
