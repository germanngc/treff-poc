using Application.Interfaces;
using Application.Interfaces.Repositories;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.FreelancerFeatures.Queries
{
    public class GetFreelancerByIdQuery : IRequest<Freelancer>
    {
        public int Id { get; set; }
        public class GetFreelancerByIdQueryHandler : IRequestHandler<GetFreelancerByIdQuery, Freelancer>
        {
            private readonly IFreelancerRepository _context;
            public GetFreelancerByIdQueryHandler(IFreelancerRepository context)
            {
                _context = context;
            }
            public async Task<Freelancer> Handle(GetFreelancerByIdQuery query, CancellationToken cancellationToken)
            {
                var freelancer = await _context.GetFreelancerByIdAsync(query.Id);
                if (freelancer == null)
                {
                    return null;
                }
                return freelancer;
            }
        }
    }
}
