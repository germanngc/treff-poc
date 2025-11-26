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

namespace Application.Features.FreelancerFeatures.Commands
{
    public class UpdateFreelancerChatIdCommand : IRequest<BasicResponse>
    {
        public int Id { get; set; }
        public string MessageId { get; set; }
        public class UpdateFreelancerChatIdCommandHandler : IRequestHandler<UpdateFreelancerChatIdCommand, BasicResponse>
        {
            private readonly IFreelancerRepository _context;
            public UpdateFreelancerChatIdCommandHandler(IFreelancerRepository context)
            {
                _context = context;
            }
            public async Task<BasicResponse> Handle(UpdateFreelancerChatIdCommand request, CancellationToken cancellationToken)
            {
                var response = new BasicResponse();

                var freelancerEntitiy = await _context.GetByIdAsync(request.Id);
                

                freelancerEntitiy.ChatId = request.MessageId;
                await _context.UpdateAsync(freelancerEntitiy);
                response.Success = true;
                response.Message = "Notificacion lista";

                return response;
            }
        }
    }
}
