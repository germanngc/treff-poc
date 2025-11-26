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
    public class GetServiceByIdQuery : IRequest<Service>
    {
        public int Id { get; set; }
        public class GetServiceByIdQueryHandler : IRequestHandler<GetServiceByIdQuery, Service>
        {
            private readonly IServiceRepository _context;
            public GetServiceByIdQueryHandler(IServiceRepository context)
            {
                _context = context;
            }
            public async Task<Service> Handle(GetServiceByIdQuery query, CancellationToken cancellationToken)
            {
                var service = await _context.GetServiceByIdAsync(query.Id);
                if (service == null)
                {
                    return null;
                }
                return service;
            }
        }
    }
}
