using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Domain.Entities
{
    public class Project
    {
        public int Id { get; set; }
        [Required]
        public int FreelancerId { get; set; }

        [ForeignKey("FreelancerId")]
        public Freelancer Freelancer { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public Freelancer User { get; set; }

        [Required]
        public int ServiceId { get; set; }

        [ForeignKey("ServiceId")]
        public Service Service { get; set; }
        [Required]
        public int PackageId { get; set; }

        [ForeignKey("PackageId")]
        public Package Package { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime CalculatedFinishDate { get; set; }
        public DateTime? FinishDate { get; set; }
        public double Price { get; set; }
        public bool Finished { get; set; }
        public Status Status { get; set; }
        public string Receipt { get; set; }
        public string ChatId { get; set; }
        public string TransactionId { get; set; }
    }

    public enum Status
    {
        Active = 1,
        CancelledByUser = 2,
        CancelledByFreelancer = 3,
        Finished = 4
    }
}
