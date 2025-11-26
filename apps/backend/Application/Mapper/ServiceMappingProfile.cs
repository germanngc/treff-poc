using Application.Features.FreelancerFeatures.Commands;
using Application.Features.ServiceFeatures.Commands;
using AutoMapper;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Mapper
{
    public class ServiceMappingProfile : Profile
    {
        public ServiceMappingProfile()
        {
            CreateMap<Service, CreateServiceCommand>().ReverseMap();
            CreateMap<Service, EditServiceCommand>().ReverseMap();
        }
    }
}
