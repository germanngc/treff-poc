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
    public class UpdateFreelancerCertificationCommand : IRequest<List<Certification>>
    {
        public List<Certification> certifications { get; set; }
        public int Id { get; set; }
        public class UpdateFreelancerCertificationCommandHandler : IRequestHandler<UpdateFreelancerCertificationCommand, List<Certification>>
        {
            private readonly IFreelancerRepository _context;
            public UpdateFreelancerCertificationCommandHandler(IFreelancerRepository context)
            {
                _context = context;
            }
            public async Task<List<Certification>> Handle(UpdateFreelancerCertificationCommand request, CancellationToken cancellationToken)
            {
                var data = await _context.UpdateCertification(request.Id, request.certifications);

                return data;
            }
        }
    }
}
