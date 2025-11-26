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
    public class SaveChatMessageCommand : IRequest<CreateMessageResponse>
    {
        public int UserId { get; set; }
        public int ToUserId { get; set; }
        public int ChatId { get; set; }
        public string Message { get; set; }
        public class SaveChatMessageCommandHandler : IRequestHandler<SaveChatMessageCommand, CreateMessageResponse>
        {
            private readonly IMessageRepository _context;
            private readonly IFreelancerRepository _contextFreelancer;
            public SaveChatMessageCommandHandler(IMessageRepository context,
                IFreelancerRepository contextFreelancer)
            {
                _context = context;
                _contextFreelancer = contextFreelancer;
            }
            public async Task<CreateMessageResponse> Handle(SaveChatMessageCommand request, CancellationToken cancellationToken)
            {
                var chatMessage = await _context.SaveMessageAsync(request.Message, request.UserId, request.ChatId);

                if (chatMessage == null)
                {
                    throw new UnauthorizedAccessException();
                }

                var freelancer = await _contextFreelancer.GetByIdAsync(request.ToUserId);

                if (freelancer == null)
                {
                    return null;
                }

                var response = new CreateMessageResponse();
                response.ChatMessage = chatMessage;
                response.ConnectionId = freelancer.ChatId;

                return response;
            }
        }
    }

    public class CreateMessageResponse
    {
        public ChatMessage ChatMessage { get; set; }
        public string ConnectionId { get; set; }
    }
}
