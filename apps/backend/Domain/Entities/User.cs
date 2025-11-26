using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Domain.Entities
{
	public class User
	{
		public int Id { get; set; }
		[Required]
		[MaxLength(500)]
		public string Name { get; set; }

		[Required]
		[MaxLength(200)]
		public string Mail { get; set; }

		[Required]
		[MaxLength(10)]
		public string Phone { get; set; }

		[Required]
		[MaxLength(100)]
		public string Password { get; set; }

		[Required]
		public bool Active { get; set; } = true;

		[Required]
		public bool Verified { get; set; } = false;
		public string Photo { get; set; }
		public bool IsAdmin { get; set; } = false;
	}
}
