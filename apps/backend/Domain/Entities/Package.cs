using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Domain.Entities
{
    public class Package
    {
		[Key]
		public int Id { get; set; }
		[Required]
		public int Time { get; set; } = 0;
		[Required]
		public double Cost { get; set; } = 0;
		[Required]
		[MaxLength(1000)]
		public string Description { get; set; }
		[Required]
		[MaxLength(200)]
		public string Name { get; set; } = "";
		[Required]
		public bool Premium { get; set; } = false;
		[Required]
		public int ServiceId { get; set; }

		[ForeignKey("ServiceId")]
		public Service Service { get; set; }
		[Required]
		public int NumReviews { get; set; } = 0;
	}
}
