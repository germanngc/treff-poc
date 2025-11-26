using Application.Features.FreelancerFeatures.Commands;
using Application.Features.ProjectFeatures.Commands;
using Application.Features.ServiceFeatures.Commands;
using AutoMapper;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Mapper
{
    public class ProjectMappingProfile : Profile
    {
        public ProjectMappingProfile()
        {
            CreateMap<Project, CreateProjectCommand>().ReverseMap();
        }
    }
}
