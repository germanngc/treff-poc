using Application.Interfaces;
using Application.Interfaces.Repositories;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;

namespace Application.Features.ProjectFeatures.Queries
{
    public class GetActiveProjectByUserIdQuery : IRequest<IEnumerable<Project>>
    {
        public int Id { get; set; }
        public int Status { get; set; }
        public class GetActiveProjectByUserIdQueryHandler : IRequestHandler<GetActiveProjectByUserIdQuery, IEnumerable<Project>>
        {
            private readonly IProjectRepository _context;
            public GetActiveProjectByUserIdQueryHandler(IProjectRepository context)
            {
                _context = context;
            }
            public async Task<IEnumerable<Project>> Handle(GetActiveProjectByUserIdQuery query, CancellationToken cancellationToken)
            {
                var project = await _context.GetActiveByUserIdAsync(query.Id, query.Status);
                if (project == null)
                {
                    throw new HttpResponseException(HttpStatusCode.NotFound);
                }
                return project;
            }
        }
    }
}
