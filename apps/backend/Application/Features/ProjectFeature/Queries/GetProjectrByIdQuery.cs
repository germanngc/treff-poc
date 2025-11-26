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
    public class GetProjectrByIdQuery : IRequest<Project>
    {
        public int Id { get; set; }
        public class GetProjectrByIdQueryHandler : IRequestHandler<GetProjectrByIdQuery, Project>
        {
            private readonly IProjectRepository _context;
            public GetProjectrByIdQueryHandler(IProjectRepository context)
            {
                _context = context;
            }
            public async Task<Project> Handle(GetProjectrByIdQuery query, CancellationToken cancellationToken)
            {
                var project = await _context.GetActiveByIdAsync(query.Id);
                if (project == null)
                {
                    throw new HttpResponseException(HttpStatusCode.NotFound);
                }
                return project;
            }
        }
    }
}
