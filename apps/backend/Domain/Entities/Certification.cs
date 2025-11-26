using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Domain.Entities
{
    public class Certification
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Institute { get; set; }
        [Required]
        public int Year { get; set; }
        [Required]
        public int FreelancerId { get; set; }
        [ForeignKey("FreelancerId")]
        public Freelancer Freelancer { get; set; }
    }
}
