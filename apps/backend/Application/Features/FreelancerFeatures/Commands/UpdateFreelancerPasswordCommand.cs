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
    public class UpdateFreelancerPasswordCommand : IRequest<BasicResponse>
    {
        public int Id { get; set; }
        public string NewPassword { get; set; }
        public string Password { get; set; }
        public class UpdateFreelancerPasswordCommandHandler : IRequestHandler<UpdateFreelancerPasswordCommand, BasicResponse>
        {
            private readonly IFreelancerRepository _context;
            public UpdateFreelancerPasswordCommandHandler(IFreelancerRepository context)
            {
                _context = context;
            }
            public async Task<BasicResponse> Handle(UpdateFreelancerPasswordCommand request, CancellationToken cancellationToken)
            {
                var response = new BasicResponse();

                var freelancerEntitiy = await _context.GetByIdAsync(request.Id);
                var password = request.Password.EncodeToBase64();

                if (freelancerEntitiy.Password != password)
                {
                    response.Success = false;
                    response.Message = "Contraseña actual incorrecta";
                    return response;
                }

                freelancerEntitiy.Password = request.NewPassword.EncodeToBase64();
                await _context.UpdateAsync(freelancerEntitiy);
                response.Success = true;
                response.Message = "Contraseña cambiada";

                return response;
            }
        }
    }
}
