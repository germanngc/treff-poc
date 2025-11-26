using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Domain.Entities
{
    public class ChatMessage
    {
        public int Id { get; set; }
        public string Message { get; set; }
        public DateTime Date { get; set; }
        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public Freelancer User { get; set; }
        [Required]
        public int ChatId { get; set; }

        [ForeignKey("ChatId")]
        public Chat Chat { get; set; }
    }
}
