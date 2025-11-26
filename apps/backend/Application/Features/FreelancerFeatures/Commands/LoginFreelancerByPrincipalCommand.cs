using Application.Interfaces.Repositories;
using Application.Mapper;
using Application.Utils;
using Domain.Entities;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.FreelancerFeatures.Commands
{
    public class LoginFreelancerByPrincipalCommand : IRequest<Freelancer>
    {
        public string Principal { get; set; }
        public class LoginFreelancerByPrincipalCommandHandler : IRequestHandler<LoginFreelancerByPrincipalCommand, Freelancer>
        {
            private readonly IFreelancerRepository _context;
            public LoginFreelancerByPrincipalCommandHandler(IFreelancerRepository context)
            {
                _context = context;
            }
            public async Task<Freelancer> Handle(LoginFreelancerByPrincipalCommand request, CancellationToken cancellationToken)
            {
                var response = await _context.GetUserByPrinicipalAsync(request.Principal);

                if (response == null)
                {
                    throw new UnauthorizedAccessException();
                }

                return response;
            }
        }
    }
}
