using Application.Interfaces;
using Application.Interfaces.Repositories;
using Application.Mapper;
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
    public class ClearNotificationCommand : IRequest<IEnumerable<Notification>>
    {
        public int FreelancerId { get; set; }
        public class ClearNotificationCommandHandler : IRequestHandler<ClearNotificationCommand, IEnumerable<Notification>>
        {
            private readonly INotificationRepository _context;
            private readonly IFreelancerRepository _contextFreelancer;
            public ClearNotificationCommandHandler(INotificationRepository context,
                IFreelancerRepository contextFreelancer)
            {
                _context = context;
                _contextFreelancer = contextFreelancer;
            }
            public async Task<IEnumerable<Notification>> Handle(ClearNotificationCommand request, CancellationToken cancellationToken)
            {

                var response = await _context.ClearNotificationsByFreelancerIdAsync(request.FreelancerId);

                return response;
            }
        }
    }
}
