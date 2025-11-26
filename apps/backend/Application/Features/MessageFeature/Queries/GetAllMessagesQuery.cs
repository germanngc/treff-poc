using Application.Models;
using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using Application.Interfaces.Repositories;
using Domain.Entities;

namespace Application.Features.MessageFeature.Queries
{
    public class GetAllMessagesQuery : IRequest<List<Message>>
    {
        public int UserId { get; set; }
        public int OtherUserId { get; set; }
        public class GetAllMessagesQueryHandler : IRequestHandler<GetAllMessagesQuery, List<Message>>
        {
            private readonly IMessageMailRepository _messageRepository;
            private readonly IMapper _mapper;

            public GetAllMessagesQueryHandler(IMessageMailRepository messageRepository, IMapper mapper)
            {
                _messageRepository = messageRepository;
                _mapper = mapper;
            }

            public async Task<List<Message>> Handle(GetAllMessagesQuery request, CancellationToken cancellationToken)
            {
                var messages = await _messageRepository.GetAllMessagesByUserId(request.UserId, request.OtherUserId);
                return messages;
            }
        }
    }
}
