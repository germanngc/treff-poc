using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Features.CategoryFeatures.Queries;
using Application.Features.ChatFeatures.Commands;
using Application.Features.NotificationFeatures.Commands;
using Application.Features.ProjectFeatures.Commands;
using Application.Features.ProjectFeatures.Queries;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using WebApi.Hubs;

namespace WebApi.Controllers.v1
{
    [ApiVersion("1.0")]
    public class NotificationController : BaseApiController
    {
        private readonly IHubContext<NotificationHub> _notificationHub;

        public NotificationController(IHubContext<NotificationHub> notificationHub)
        {
            _notificationHub = notificationHub;
        }

        //[HttpPost("messages")]
        //public async Task Post(ChatMessage message)
        //{
        //    // run some logic...

        //    await _chatHub.Clients.All.ReceiveMessage(message);
        //}

        [HttpPost("add")]
        public async Task Add(CreateNotificationCommand command)
        {
            var notification = await Mediator.Send(command);
            notification.Notification.Freelancer.Notifications = null;
            //message.Message = "se conectó al chat";
            await _notificationHub.Clients.Client(notification.ConnectionId.ToString())
                .SendAsync("ReceiveNotification", notification.Notification);
            // run some logic...

            //await _chatHub.Clients.Group(message.Group).SendAsync("", message);
        }

        [HttpPost("byFreelancer")]
        public async Task<IActionResult> GetByFreelancer(GetNotificationsByFreelancerIdQuery command)
        {
            return Ok(await Mediator.Send(command));
            
        }

        [HttpPost("clearByFreelancer")]
        public async Task<IActionResult> ClearByFreelancer(ClearNotificationCommand command)
        {
            return Ok(await Mediator.Send(command));

        }
    }
}