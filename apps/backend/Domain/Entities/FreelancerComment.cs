using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Domain.Entities
{
    public class FreelancerComment
    {
        public int Id { get; set; }
        [Required]
        public int FreelancerId { get; set; }
        [ForeignKey("FreelancerId")]
        public Freelancer Freelancer { get; set; }
        [Required]
        public int CommentId { get; set; }
        [ForeignKey("CommentId")]
        public Comment Comment { get; set; }
    }
}
