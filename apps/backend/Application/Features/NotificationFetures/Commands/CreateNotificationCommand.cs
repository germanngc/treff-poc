using Application.Interfaces;
using Application.Interfaces.Repositories;
using Application.Mapper;
using Application.Models;
using Application.Utils;
using Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;

namespace Application.Features.NotificationFeatures.Commands
{
    public class CreateNotificationCommand : IRequest<CreateNotificationResponse>
    {
        public int UserId { get; set; }
        public NotificationType NotificationType { get; set; }
        public int IdNotificationType { get; set; }
        public int ClientId { get; set; }
        public class CreateNotificationCommandHandler : IRequestHandler<CreateNotificationCommand, CreateNotificationResponse>
        {
            private readonly INotificationRepository _context;
            private readonly IFreelancerRepository _contextFreelancer;
            public CreateNotificationCommandHandler(INotificationRepository context,
                IFreelancerRepository contextFreelancer)
            {
                _context = context;
                _contextFreelancer = contextFreelancer;
            }
            public async Task<CreateNotificationResponse> Handle(CreateNotificationCommand request, CancellationToken cancellationToken)
            {
                var notification = new Notification();
                notification.UserId = request.UserId;
                notification.NotificationType = request.NotificationType;
                notification.IdNotificationType = request.IdNotificationType;
                notification.ClientId = request.ClientId;
                notification.Read = false;
                notification.Created = DateTime.Now;

                var freelancer = await _contextFreelancer.GetByIdAsync(request.UserId);

                if(freelancer == null)
                {
                    return null;
                }

                var data = await _context.AddAsync(notification);


                var response = new CreateNotificationResponse();
                response.Notification = await _context.GetNotificationByIdAsync(data.Id);
                response.ConnectionId = freelancer.NotificationId;

                return response;
            }
        }
    }
}
