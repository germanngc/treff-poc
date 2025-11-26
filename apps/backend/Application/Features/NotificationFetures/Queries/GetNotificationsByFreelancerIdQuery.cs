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
    public class GetNotificationsByFreelancerIdQuery : IRequest<IEnumerable<Notification>>
    {
        public int FreelancerId { get; set; }
        public bool OnlyUnread { get; set; }
        public class GetNotificationsByFreelancerIdQueryHandler : IRequestHandler<GetNotificationsByFreelancerIdQuery, IEnumerable<Notification>>
        {
            private readonly INotificationRepository _context;
            private readonly IFreelancerRepository _contextFreelancer;
            public GetNotificationsByFreelancerIdQueryHandler(INotificationRepository context,
                IFreelancerRepository contextFreelancer)
            {
                _context = context;
                _contextFreelancer = contextFreelancer;
            }
            public async Task<IEnumerable<Notification>> Handle(GetNotificationsByFreelancerIdQuery request, CancellationToken cancellationToken)
            {
                var response = await _context
                    .GetNotificationByFreelancerIdAsync(request.FreelancerId, request.OnlyUnread);

                return response;
            }
        }
    }
}
