using Application.Interfaces;
using Application.Interfaces.Repositories;
using Application.Interfaces.Repositories.Base;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Persistence.Context;
using Persistence.Repositories;
using Persistence.Repositories.Base;
using MediatR;
using System.Reflection;
using Infrastructure.Services;
using Application.Interfaces.Services;
using Persistence.Services;

namespace Persistence
{
    public static class DependencyInjection
    {
        public static void AddPersistence(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddMediatR(Assembly.GetExecutingAssembly());
            // services.AddScoped<IApplicationDbContext>(provider => provider.GetService<ApplicationDbContext>());
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            services.AddTransient<ICategoryRepository, CategoryRepository>();
            services.AddTransient<IServiceRepository, ServiceRepository>();
            services.AddTransient<IFreelancerRepository, FreelancerRepository>();
            services.AddTransient<IFreelancerVerificationRepository, FreelancerVerificationRepository>();
            services.AddTransient<IProjectRepository, ProjectRepository>();
            services.AddTransient<IMessageRepository, MessageRepository>();
            services.AddTransient<INotificationRepository, NotificationRepository>();
            services.AddTransient<IMessageMailRepository, MessageMailRepository>();
            services.AddTransient<IAzureBlobService, AzureBlobService>();
            services.AddTransient<ITwilioService, TwilioService>();
        }
    }
}
