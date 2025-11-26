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
    public class UpdateFreelancerNotificationIdCommand : IRequest<BasicResponse>
    {
        public int Id { get; set; }
        public string NotificationId { get; set; }
        public class UpdateFreelancerNotificationIdCommandHandler : IRequestHandler<UpdateFreelancerNotificationIdCommand, BasicResponse>
        {
            private readonly IFreelancerRepository _context;
            public UpdateFreelancerNotificationIdCommandHandler(IFreelancerRepository context)
            {
                _context = context;
            }
            public async Task<BasicResponse> Handle(UpdateFreelancerNotificationIdCommand request, CancellationToken cancellationToken)
            {
                var response = new BasicResponse();

                var freelancerEntitiy = await _context.GetByIdAsync(request.Id);
                

                freelancerEntitiy.NotificationId = request.NotificationId;
                await _context.UpdateAsync(freelancerEntitiy);
                response.Success = true;
                response.Message = "Notificacion lista";

                return response;
            }
        }
    }
}
