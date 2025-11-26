using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Domain.Entities
{
    [Table("Attachments")]
    public class Attachment
    {
        [Key]
        public int AttachmentId { get; set; }

        [ForeignKey("Message")]
        public int MessageId { get; set; }

        public string FileName { get; set; }

        // Other properties specific to the attachment, e.g., Azure Storage URL

        // Navigation property
        public virtual Message Message { get; set; }
    }
}
