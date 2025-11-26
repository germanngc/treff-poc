using Application.Features.FreelancerFeatures.Commands;
using AutoMapper;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Mapper
{
    public class FreelancerMappingProfile: Profile
    {
        public FreelancerMappingProfile()
        {
            CreateMap<Freelancer, CreateFreelancerCommand>().ReverseMap();
            CreateMap<Freelancer, UpdateFreelancerCommand>().ReverseMap();
            CreateMap<Freelancer, LoginFreelancerCommand>().ReverseMap();
            CreateMap<Freelancer, CreateFreelancerThirdPartyCommand>().ReverseMap();
        }
    }
}
