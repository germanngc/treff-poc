using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Domain.Entities
{
    public class Chat
    {
        public int Id { get; set; }
        public string Identifier { get; set; }
        public DateTime Created { get; set; }
        [Required]
        public int FreelancerId { get; set; }

        [ForeignKey("FreelancerId")]
        public Freelancer Freelancer { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public Freelancer User { get; set; }
        public IEnumerable<ChatMessage> ChatMessages { get; set; }
    }
}
