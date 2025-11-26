using Application.Interfaces.Repositories;
using Application.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using Domain.Entities;

namespace Application.Features.MessageFeature.Queries
{
    public class GetMessagesByFreelancerIdQuery : IRequest<List<Message>>
    {
        public int FreelancerId { get; set; }
        public class GetMessagesByFreelancerIdQueryHandler : IRequestHandler<GetMessagesByFreelancerIdQuery, List<Message>>
        {
            private readonly IMessageMailRepository _messageRepository;

            public GetMessagesByFreelancerIdQueryHandler(IMessageMailRepository messageRepository)
            {
                _messageRepository = messageRepository;
            }

            public async Task<List<Message>> Handle(GetMessagesByFreelancerIdQuery request, CancellationToken cancellationToken)
            {
                return await _messageRepository.GetMessagesByFreelancerId(request.FreelancerId);
            }
        }
    }
}
