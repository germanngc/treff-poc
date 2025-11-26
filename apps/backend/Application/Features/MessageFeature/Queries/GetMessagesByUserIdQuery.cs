using Application.Interfaces.Repositories;
using Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Threading;

namespace Application.Features.MessageFeature.Queries
{
    public class GetMessagesByUserIdQuery : IRequest<List<Message>>
    {
        public int UserId { get; set; }
        public class GetMessagesByUserIdQueryHandler : IRequestHandler<GetMessagesByUserIdQuery, List<Message>>
        {
            private readonly IMessageMailRepository _messageRepository;

            public GetMessagesByUserIdQueryHandler(IMessageMailRepository messageRepository)
            {
                _messageRepository = messageRepository;
            }

            public async Task<List<Message>> Handle(GetMessagesByUserIdQuery request, CancellationToken cancellationToken)
            {
                return await _messageRepository.GetMessagesByUserId(request.UserId);
            }
        }
    }
}
