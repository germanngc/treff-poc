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
    public class CreateFreelancerCommand : IRequest<Freelancer>
    {
        public string Name { get; set; }
        public string Mail { get; set; }
        public string Password { get; set; }
        public bool IsAdmin { get; set; } = false;
        public bool IsFreelancer { get; set; } = true;
        public class CreateFreelancerCommandHandler : IRequestHandler<CreateFreelancerCommand, Freelancer>
        {
            private readonly IFreelancerRepository _context;
            public CreateFreelancerCommandHandler(IFreelancerRepository context)
            {
                _context = context;
            }
            public async Task<Freelancer> Handle(CreateFreelancerCommand request, CancellationToken cancellationToken)
            {
                var freelancerEntitiy = FreelancerMapper.Mapper.Map<Freelancer>(request);
                freelancerEntitiy.Password = request.Password.EncodeToBase64();
                await _context.AddAsync(freelancerEntitiy);
                return freelancerEntitiy;
            }
        }
    }
}
