using Application.Interfaces.Repositories.Base;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories
{
    public interface IServiceRepository : IRepository<Service>
    {
        Task<List<Service>> GetAllServicesByCategoryIdAsync(int categoryId, bool byFreelance = false);
        Task<List<Service>> GetAllServicesPremiumByCategoryIdAsync(int categoryId, bool byFreelance = false);
        Task<List<Service>> GetAllServicesPremiumAsync(int limit, bool byFreelance = false);
        Task<List<Service>> GetAllServicesAsync(int limit, bool byFreelance = false);
        Task<Service> GetServiceByIdAsync(int id);
        Task<int> DeleteImagesServiceByIdAsync(int id);
        Task<int> DeleteFaqsServiceByIdAsync(int id);
        Task<int> AddViewAsync(ServiceView serviceView);
        Task<List<Service>> FilterServicesAsync(string serviceName, bool byService, 
            int categoryId, bool? expressDelivery, bool? verified, bool? invoice, int filterOption = 0);
    }
}
