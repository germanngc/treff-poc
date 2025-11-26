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

namespace Application.Features.ChatFeatures.Commands
{
    public class GetOrCreateChatCommand : IRequest<Chat>
    {
        public int UserId { get; set; }
        public int FreelancerId { get; set; }
        public class GetOrCreateChatCommandHandler : IRequestHandler<GetOrCreateChatCommand, Chat>
        {
            private readonly IMessageRepository _context;
            public GetOrCreateChatCommandHandler(IMessageRepository context)
            {
                _context = context;
            }
            public async Task<Chat> Handle(GetOrCreateChatCommand request, CancellationToken cancellationToken)
            {
                var response = await _context.GetAllMessagesAsync(request.UserId, request.FreelancerId);

                if (response == null)
                {
                    throw new UnauthorizedAccessException();
                }

                return response;
            }
        }
    }
}
