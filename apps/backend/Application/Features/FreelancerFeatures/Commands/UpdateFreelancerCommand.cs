using Application.Interfaces;
using Application.Interfaces.Repositories;
using Application.Mapper;
using Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.FreelancerFeatures.Commands
{
    public class UpdateFreelancerCommand : IRequest<Freelancer>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Mail { get; set; }
        public string Phone { get; set; }
        public string PhoneCode { get; set; }
        public bool Active { get; set; }
        public bool Verified { get; set; }
        public bool Invoice { get; set; }
        public string Photo { get; set; }
        public string Title { get; set; }
        public string Country { get; set; }
        public string Description { get; set; }
        public DateTime ActiveDate { get; set; }
        public string WhyMe { get; set; }
        public double Score { get; set; }
        public string Skills { get; set; }
        public bool IsAdmin { get; set; } = false;
        public bool IsFreelancer { get; set; } = true;
        public class UpdateFreelancerCommandHandler : IRequestHandler<UpdateFreelancerCommand, Freelancer>
        {
            private readonly IFreelancerRepository _context;
            public UpdateFreelancerCommandHandler(IFreelancerRepository context)
            {
                _context = context;
            }
            public async Task<Freelancer> Handle(UpdateFreelancerCommand request, CancellationToken cancellationToken)
            {
                var freelancerEntitiy = await _context.GetByIdAsync(request.Id);

                if (freelancerEntitiy == null)
                {
                    throw new Exception();
                }

                var password = freelancerEntitiy.Password;
                freelancerEntitiy = FreelancerMapper.Mapper.Map<Freelancer>(request);
                freelancerEntitiy.Password = password;

                await _context.UpdateAsync(freelancerEntitiy);

                freelancerEntitiy = await _context.GetFreelancerByIdAsync(request.Id);

                
                return freelancerEntitiy;
            }
        }
    }
}
