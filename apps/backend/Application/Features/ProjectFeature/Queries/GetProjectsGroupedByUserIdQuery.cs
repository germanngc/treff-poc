using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using Application.Interfaces.Repositories;
using Domain.Entities;

namespace Application.Features.ProjectFeature.Queries
{
    public class GetProjectsGroupedByUserIdQuery : IRequest<List<Project>>
    {
        public int FreelancerId { get; set; }
    }

    public class GetProjectsGroupedByUserIdQueryHandler : IRequestHandler<GetProjectsGroupedByUserIdQuery, List<Project>>
    {
        private readonly IProjectRepository _projectService;

        public GetProjectsGroupedByUserIdQueryHandler(IProjectRepository projectService, IMapper mapper)
        {
            _projectService = projectService;
        }

        public async Task<List<Project>> Handle(GetProjectsGroupedByUserIdQuery request, CancellationToken cancellationToken)
        {
            var projects = await _projectService.GetProjectsGroupedByUserId(request.FreelancerId);

            if (projects == null)
            {
                return null;
            }

            return projects;
        }
    }

}
