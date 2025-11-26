using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Domain.Entities
{
    public class Education
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Country { get; set; }
        [Required]
        public string University { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public string TitleName { get; set; }
        [Required]
        public int Year { get; set; }
        [Required]
        public int FreelancerId { get; set; }
        [ForeignKey("FreelancerId")]
        public Freelancer Freelancer { get; set; }
    }
}
