using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using Application.Interfaces.Repositories;
using Domain.Entities;
using Application.Models;

namespace Application.Features.ProjectFeature.Queries
{
    public class GetProjectsAndViewsByUserIdQuery : IRequest<ProjectAndViewsResponse>
    {
        public int FreelancerId { get; set; }
    }

    public class GetProjectsAndViewsByUserIdQueryHandler : IRequestHandler<GetProjectsAndViewsByUserIdQuery, ProjectAndViewsResponse>
    {
        private readonly IProjectRepository _projectService;

        public GetProjectsAndViewsByUserIdQueryHandler(IProjectRepository projectService, IMapper mapper)
        {
            _projectService = projectService;
        }

        public async Task<ProjectAndViewsResponse> Handle(GetProjectsAndViewsByUserIdQuery request, CancellationToken cancellationToken)
        {
            var projects = await _projectService.GetProjectsAndViewsByUserId(request.FreelancerId);

            if (projects == null)
            {
                return null;
            }

            return projects;
        }
    }

}
