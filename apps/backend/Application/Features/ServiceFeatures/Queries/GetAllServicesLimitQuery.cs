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

namespace Application.Features.ServiceFeatures.Queries
{
    public class GetAllServicesLimitQuery : IRequest<IEnumerable<Service>>
    {
        public int Limit { get; set; }
        public bool ByFreelancer { get; set; }
        public class GetAllServicesLimitQueryHandler : IRequestHandler<GetAllServicesLimitQuery, IEnumerable<Service>>
        {
            private readonly IServiceRepository _context;
            public GetAllServicesLimitQueryHandler(IServiceRepository context)
            {
                _context = context;
            }
            public async Task<IEnumerable<Service>> Handle(GetAllServicesLimitQuery query, CancellationToken cancellationToken)
            {
                var serviceList = await _context.GetAllServicesAsync(query.Limit, query.ByFreelancer);
                if (serviceList == null)
                {
                    return null;
                }
                return serviceList.AsReadOnly();
            }
        }
    }
}
