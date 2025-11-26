using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities
{
	public class Service
	{
		[Key]
		public int Id { get; set; }

		[Required]
		[MaxLength(500)]
		public string Name { get; set; }

		[Required]
		public int CategoryMainId { get; set; }

		[Required]
		public int CategoryId { get; set; }

		[ForeignKey("CategoryId")]
		public Category Category { get; set; }

		[Required]
		[MaxLength(1000)]
		public string KeyWords { get; set; }

		[Required]
		[MaxLength(5200)]
		public string Description { get; set; }
		[Required]
		[MaxLength(200)]
		public string MainImage { get; set; }
		public ICollection<Package> Packages { get; set; }

		[Required]
		public int FreelancerId { get; set; }

		[ForeignKey("FreelancerId")]
		public Freelancer Freelancer { get; set; }

		[Required]
		public bool Highlight { get; set; } = false;

		[Required]
		public bool ExpressDelivery { get; set; } = false;

		[Required]
		public string Requirements { get; set; }
		public bool IsMexico { get; set; } = false;
		public DateTime CreatedAt { get; set; } = DateTime.Now;
		public ICollection<ServiceImage> ServiceImages { get; set; }
		public ICollection<Faq> Faqs { get; set; }
		public ICollection<ServiceView> Views { get; set; }
	}
}
