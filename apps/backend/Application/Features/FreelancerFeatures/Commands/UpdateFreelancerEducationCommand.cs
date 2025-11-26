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
    public class UpdateFreelancerEducationCommand : IRequest<List<Education>>
    {
        public List<Education> educations { get; set; }
        public int Id { get; set; }
        public class UpdateFreelancerEducationCommandHandler : IRequestHandler<UpdateFreelancerEducationCommand, List<Education>>
        {
            private readonly IFreelancerRepository _context;
            public UpdateFreelancerEducationCommandHandler(IFreelancerRepository context)
            {
                _context = context;
            }
            public async Task<List<Education>> Handle(UpdateFreelancerEducationCommand request, CancellationToken cancellationToken)
            {
                var data = await _context.UpdateEducation(request.Id, request.educations);

                return data;
            }
        }
    }
}
