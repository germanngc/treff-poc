using Application.Interfaces;
using Application.Interfaces.Repositories;
using Application.Mapper;
using Application.Utils;
using Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.FreelancerFeatures.Commands
{
    public class CreateFreelancerThirdPartyCommand : IRequest<Freelancer>
    {
        public string FacebookId { get; set; }
        public string Mail { get; set; }
        public string Name { get; set; }
        public string Photo { get; set; }
        public class CreateFreelancerThirdPartyCommandHandler : IRequestHandler<CreateFreelancerThirdPartyCommand, Freelancer>
        {
            private readonly IFreelancerRepository _context;
            public CreateFreelancerThirdPartyCommandHandler(IFreelancerRepository context)
            {
                _context = context;
            }
            public async Task<Freelancer> Handle(CreateFreelancerThirdPartyCommand request, CancellationToken cancellationToken)
            {
                var freelancerEntitiy = FreelancerMapper.Mapper.Map<Freelancer>(request);
                freelancerEntitiy.Password = "";
                var response = await _context.LoginThirdPartyAsync(freelancerEntitiy);
                return response;
            }
        }
    }
}
