using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace Domain
{
    public static class DependencyInjection
    {
        public static void AddCore(this IServiceCollection services)
        {
            services.AddMediatR(Assembly.GetExecutingAssembly());
        }
    }
}
