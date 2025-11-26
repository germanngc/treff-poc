using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Models
{
    public class CreateNotificationResponse
    {
        public Notification Notification { get; set; }
        public string ConnectionId { get; set; }
    }
}
