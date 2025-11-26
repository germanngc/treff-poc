using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Domain.Entities
{
    public class Language
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Level { get; set; }
        [Required]
        public int FreelancerId { get; set; }
        [ForeignKey("FreelancerId")]
        public Freelancer Freelancer { get; set; }
    }
}
