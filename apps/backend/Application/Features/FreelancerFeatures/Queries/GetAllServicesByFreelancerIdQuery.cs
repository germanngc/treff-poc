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
    public class GetAllServicesByFreelancerIdQuery : IRequest<IEnumerable<Service>>
    {
        public int FreelancerId { get; set; }
        public class GetAllServicesByFreelancerIdQueryHandler : IRequestHandler<GetAllServicesByFreelancerIdQuery, IEnumerable<Service>>
        {
            private readonly IFreelancerRepository _context;
            public GetAllServicesByFreelancerIdQueryHandler(IFreelancerRepository context)
            {
                _context = context;
            }
            public async Task<IEnumerable<Service>> Handle(GetAllServicesByFreelancerIdQuery query, CancellationToken cancellationToken)
            {
                var serviceList = await _context.GetAllServicesByFreelancerIdAsync(query.FreelancerId);
                if (serviceList == null)
                {
                    return null;
                }
                return serviceList.AsReadOnly();
            }
        }
    }
}
