using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Domain.Entities
{
    public class Notification
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public NotificationType NotificationType { get; set; }
        public int IdNotificationType { get; set; }
        public bool Read { get; set; }
        public DateTime Created { get; set; }

        public int ClientId { get; set; }
        [ForeignKey("ClientId")]
        public Freelancer Freelancer { get; set; }
    }

    public enum NotificationType
    {
        NewProject = 1,
        CanceledProject = 2,
        Message = 3,

    }
}
