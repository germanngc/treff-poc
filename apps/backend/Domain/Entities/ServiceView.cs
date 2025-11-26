using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Domain.Entities
{
    public class ServiceView
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int ServiceId { get; set; }
        [ForeignKey("ServiceId")]
        public Service Service { get; set; }
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public Freelancer User { get; set; }

        public DateTime Date { get; set; }
 
    }
}
