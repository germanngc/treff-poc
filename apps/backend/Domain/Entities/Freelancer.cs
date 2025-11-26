using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace Domain.Entities
{
	public class Freelancer
	{
		[Key]
		public int Id { get; set; }

		[Required]
		[MaxLength(500)]
		public string Name { get; set; }

		[Required]
		[MaxLength(200)]
		public string Mail { get; set; }

		[MaxLength(15)]
		public string Phone { get; set; } = "";
		public string PhoneCode { get; set; } = "";

		[Required]
		[MaxLength(100)]
		public string Password { get; set; }
		public string IcpPrincipal { get; set; }

		[Required]
		public bool Active { get; set; } = true;

		[Required]
		public bool Verified { get; set; } = false;

		[Required]
		public bool Invoice { get; set; } = false;
		public string Photo { get; set; }
		public string Cover { get; set; }
		public string Title { get; set; }
		public string Country { get; set; }
		public string Description { get; set; }
		public DateTime ActiveDate { get; set; } = DateTime.Now;

		[MaxLength(5200)]
		public string WhyMe { get; set; }
		public double Score { get; set; }
		[MaxLength(5200)]
		public string Skills { get; set; }
		public string NotificationId { get; set; }
		public string ChatId { get; set; }
		public string FacebookId { get; set; }
		public bool IsAdmin { get; set; } = false;
		public bool IsFreelancer { get; set; } = true;
		public IEnumerable<FreelancerComment> FreelancerComments { get; set; }
		public IEnumerable<Education> Educations { get; set; }
		public IEnumerable<Certification> Certifications { get; set; }
		public IEnumerable<Language> Languages { get; set; }
		public IEnumerable<FreelancerVerification> Verifications { get; set; }
		public IEnumerable<Notification> Notifications { get; set; }
	}
}
