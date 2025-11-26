using Application.Features.CategoryFeatures.Queries;
using Application.Features.FreelancerFeatures.Commands;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;

namespace Application
{
    public static class DependencyInjection
    {
        public static void AddApplication(this IServiceCollection services)
        {
            services.AddMediatR(Assembly.GetExecutingAssembly());
            services.AddMediatR(typeof(GetAllCategoriesQuery).Assembly);
            services.AddMediatR(typeof(ValidateSmsFreelancerCommand).Assembly);
        }
    }
}

