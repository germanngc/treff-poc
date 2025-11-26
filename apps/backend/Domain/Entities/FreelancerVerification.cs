using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Domain.Entities
{
    public class FreelancerVerification
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public string Value { get; set; }
        public bool Verificated { get; set; } = false;
        public string Code { get; set; }
        public DateTime CreatedTime { get; set; } = DateTime.Now;
        public DateTime VerificationTime { get; set; } = DateTime.Now;
        [Required]
        public int FreelancerId { get; set; }
        [ForeignKey("FreelancerId")]
        public Freelancer Freelancer { get; set; }
    }
}
