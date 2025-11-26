using Application.Interfaces.Repositories;
using Domain.Entities;
using Persistence.Context;
using Persistence.Repositories.Base;
using System;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Persistence.Repositories
{
    public class ServiceRepository : Repository<Service>, IServiceRepository
    {
        public ServiceRepository(treff_v2Context treffContext) : base(treffContext) { }

        private List<int> getCategoryIds(List<Category> categories)
        {
            var catIds = new List<int>();

            foreach (var category in categories)
            {
                catIds.Add(category.Id);

                if (category.SubCategories != null)
                {
                    var subIds = getCategoryIds(category.SubCategories);
                    if (subIds.Count > 0)
                    {
                        catIds = catIds.Concat(subIds).ToList();
                    }
                }
            }
            return catIds;
        }

        public async Task<List<Service>> GetAllServicesByCategoryIdAsync(int categoryId, bool byFreelance = false)
        {
            var categories = await _treffContext.Categories
                .Where(c => c.Deleted == 0
                    //&& c.Parent == null
                    && c.Id == categoryId)
                .Include(c => c.SubCategories)
                .ThenInclude(s => s.SubCategories)
                .ThenInclude(s => s.Parent)
                .ToListAsync();

            var catIds = getCategoryIds(categories);

            var services = await _treffContext.Services
                .Include(s => s.Freelancer)
                .Include(s => s.Packages)
                .Include(s => s.Category)
                .OrderBy(s => s.Id)
                .Where(s => catIds.Contains(s.CategoryId) && s.Freelancer.Active == true)
                .ToListAsync();

            services.ForEach(x => x.Packages = x.Packages.OrderBy(y => y.Cost).ToList());

            services.ForEach(s =>
                {
                    s.Category.SubCategories = null;
                    s.Category.Parent = null;
                }
            );

            if (!byFreelance)
            {
                return services;
            }
            else
            {
                return services.GroupBy(s => s.FreelancerId)
                .Select(s => s.First()).ToList();
            }
        }

        public async Task<List<Service>> GetAllServicesPremiumByCategoryIdAsync(int categoryId, bool byFreelance = false)
        {
            var categories = await _treffContext.Categories
                .Where(c => c.Deleted == 0
                    //&& c.Parent == null
                    && c.Id == categoryId)
                .Include(c => c.SubCategories)
                .ThenInclude(s => s.SubCategories)
                .ThenInclude(s => s.Parent)
                .ToListAsync();

            var catIds = getCategoryIds(categories);

            var services = await _treffContext.Services
                .Include(s => s.Freelancer)
                .Include(s => s.Packages)
                .Include(s => s.Category)
                .OrderBy(s => s.Id)
                .Where(s => catIds.Contains(s.CategoryId)
                    && s.Highlight == true && s.Freelancer.Active == true)
                .ToListAsync();

            services.ForEach(x => x.Packages = x.Packages.OrderBy(y => y.Cost).ToList());

            services.ForEach(s =>
            {
                s.Category.SubCategories = null;
                s.Category.Parent = null;
            }
            );

            if (!byFreelance)
            {
                return services;
            }
            else
            {
                return services.GroupBy(s => s.FreelancerId)
                .Select(s => s.First()).ToList();
            }
        }

        public async Task<List<Service>> GetAllServicesPremiumAsync(int limit, bool byFreelance = false)
        {
            var services = await _treffContext.Services
                .Where(s => s.Highlight == true)
                .Include(s => s.Freelancer)
                .Include(s => s.Packages)
                .Include(s => s.Category)
                .Where(s => s.Freelancer.Active == true)
                .OrderBy(s => s.Id)
                .Take(limit)
                .ToListAsync();

            services.ForEach(x => x.Packages = x.Packages.OrderBy(y => y.Cost).ToList());

            if (!byFreelance)
            {
                return services;
            }
            else
            {
                return services.GroupBy(s => s.FreelancerId)
                .Select(s => s.First()).ToList();
            }
        }

        public async Task<List<Service>> GetAllServicesAsync(int limit, bool byFreelance = false)
        {
            var services = await _treffContext.Services
                .Include(s => s.Freelancer)
                .Include(s => s.Packages)
                .Include(s => s.Category)
                .Where(s => s.Freelancer.Active == true)
                .OrderBy(s => s.Id)
                .Take(limit)
                .ToListAsync();

            services.ForEach(x => x.Packages = x.Packages.OrderBy(y => y.Cost).ToList());

            if (!byFreelance)
            {
                return services;
            }
            else
            {
                return services.GroupBy(s => s.FreelancerId)
                .Select(s => s.First()).ToList();
            }
        }

        public async Task<Service> GetServiceByIdAsync(int id)
        {
            var service = await _treffContext.Services
                .Include(s => s.Freelancer)
                .ThenInclude(f => f.FreelancerComments)
                .ThenInclude(c => c.Comment)
                .ThenInclude(u => u.User)
                .Include(s => s.Packages)
                .Include(s => s.Category)
                .Include(s => s.ServiceImages)
                .Include(s => s.Views)
                .Where(s => s.Id == id)
                .FirstOrDefaultAsync();

            service.Packages = service.Packages.OrderBy(y => y.Cost).ToList();

            return service;
        }

        public async Task<int> DeleteImagesServiceByIdAsync(int id)
        {
            var serviceImages = await _treffContext.ServiceImages
                .Where(s => s.ServiceId == id)
                .ToListAsync();

            var total = serviceImages.Count;

            _treffContext.RemoveRange(serviceImages);

            _treffContext.SaveChanges();

            return total;
        }

        public async Task<int> DeleteFaqsServiceByIdAsync(int id)
        {
            var serviceFaqs = await _treffContext.Faqs
                .Where(s => s.ServiceId == id)
                .ToListAsync();

            var total = serviceFaqs.Count;

            _treffContext.RemoveRange(serviceFaqs);

            _treffContext.SaveChanges();

            return total;
        }

        public async Task<int> AddViewAsync(ServiceView serviceView)
        {
            var service = await _treffContext.Services
                .Where(s => s.Id == serviceView.ServiceId)
                .Include(s => s.Views)
                .FirstOrDefaultAsync();
            if (service == null)
            {
                return 0;
            }
            if (service.Views == null)
            {
                service.Views = new List<ServiceView>();
            }

            var view = service.Views
                .Where(v => v.UserId == serviceView.UserId)
                .OrderByDescending(v => v.Date)
                .FirstOrDefault();

            DateTime now = DateTime.Now;
            DateTime date = view == null ? DateTime.Now.AddDays(-1) : view.Date;
            TimeSpan difference = now.Subtract(date);
            if (difference.TotalMinutes > 30)
            {
                service.Views.Add(serviceView);
                _treffContext.SaveChanges();
            }
            return 1;
        }

        public async Task<List<Service>> FilterServicesAsync(string serviceName, bool byService, int categoryId, bool? expressDelivery, bool? verified, bool? invoice, int filterOption = 0)
        {
            var services = new List<Service>();

            if (byService)
            {
                services = await _treffContext.Services
                    .Include(s => s.Freelancer)
                    .Include(s => s.Packages)
                    .Include(s => s.Category)
                    .Where(s => s.Freelancer.Active == true)
                    .OrderBy(s => s.Id)
                    .ToListAsync();
            }
            else
            {
                services = _treffContext.Services
                    .Include(s => s.Freelancer)
                    .Include(s => s.Packages)
                    .Include(s => s.Category)
                    .Where(s => s.Freelancer.Active == true)
                    .AsEnumerable() // Se realiza AsEnumerable para traer los datos a memoria y poder operar sobre ellos
                    .GroupBy(s => s.FreelancerId) // Agrupa por FreelancerID
                    .Select(g => g.First()) // Selecciona el primer servicio de cada grupo
                    .OrderBy(s => s.Id) // Ordena los servicios por su Id
                    .ToList();
            }

            if (!string.IsNullOrEmpty(serviceName) && byService)
            {
                services = services.Where(s => s.Name.ToLower().Contains(serviceName.ToLower())).ToList();
            }
            else {
                services = services.Where(s => s.Freelancer.Name.ToLower().Contains(serviceName.ToLower())).ToList();
            }

            if (categoryId > 0)
            {
                services = services.Where(s => s.CategoryMainId == categoryId).ToList();
            }

            if (expressDelivery != null)
            {
                services = services.Where(s => s.ExpressDelivery == expressDelivery).ToList();
            }

            if (verified != null)
            {
                services = services.Where(s => s.Freelancer.Verified == verified).ToList();
            }

            if (invoice != null)
            {
                services = services.Where(s => s.Freelancer.Invoice == invoice).ToList();
            }

            services.ForEach(x => x.Packages = x.Packages.OrderBy(y => y.Cost).ToList());
            //////////////// 0 = Default, 1 = Price High to Low, 2 = Price Low to High, 3 = Score, 4 = Date High to Low, 5 = Date Low to High ////////////////
            if (filterOption == 1)
            {
                services = services.OrderByDescending(s => s.Packages.FirstOrDefault().Cost).ToList();
            }
            else if (filterOption == 2)
            {
                services = services.OrderBy(s => s.Packages.FirstOrDefault().Cost).ToList();
            }
            else if (filterOption == 3)
            {
                services = services.OrderByDescending(s => s.Freelancer.Score).ToList();
            }
            else if (filterOption == 4)
            {
                services = services.OrderByDescending(s => s.CreatedAt).ToList();
            }
            else if (filterOption == 5)
            {
                services = services.OrderBy(s => s.CreatedAt).ToList();
            }

            return services;
        }
    }
}
