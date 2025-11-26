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
    public class GetAllServicesByCategoryIdQuery : IRequest<IEnumerable<Service>>
    {
        public int CategoryId { get; set; }
        public bool ByFreelancer { get; set; }
        public class GetAllServicesByCategoryIdQueryHandler : IRequestHandler<GetAllServicesByCategoryIdQuery, IEnumerable<Service>>
        {
            private readonly IServiceRepository _context;
            public GetAllServicesByCategoryIdQueryHandler(IServiceRepository context)
            {
                _context = context;
            }
            public async Task<IEnumerable<Service>> Handle(GetAllServicesByCategoryIdQuery query, CancellationToken cancellationToken)
            {
                var serviceList = await _context.GetAllServicesByCategoryIdAsync(query.CategoryId, query.ByFreelancer);
                if (serviceList == null)
                {
                    return null;
                }
                return serviceList.AsReadOnly();
            }
        }
    }
}
