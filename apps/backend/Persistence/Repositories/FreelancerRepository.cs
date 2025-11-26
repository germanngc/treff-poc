using Application.Interfaces.Repositories;
using Domain.Entities;
using Persistence.Context;
using Persistence.Repositories.Base;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repositories
{
    public class FreelancerRepository : Repository<Freelancer>, IFreelancerRepository
    {
        public FreelancerRepository(treff_v2Context treffContext) : base(treffContext) { }

        public async Task<Freelancer> GetFreelancerByIdAsync(int freelancerId)
        {
            var freelancer = await _treffContext.Freelancers
                .Include(s => s.FreelancerComments)
                .ThenInclude(c => c.Comment)
                .ThenInclude(u => u.User)
                .Include(l => l.Languages)
                .Include(c => c.Certifications)
                .Include(e => e.Educations)
                .Include(v => v.Verifications)
                .Where(s => s.Id == freelancerId)
                .FirstOrDefaultAsync();
            freelancer.Password = null;

            return freelancer;
        }
        public async Task<List<Service>> GetAllServicesByFreelancerIdAsync(int freelancerId)
        {
            var services = await _treffContext.Services
                .Include(s => s.Freelancer)
                .Include(s => s.Category)
                .Include(s => s.Packages)
                .Include(s => s.ServiceImages)
                .Include(s => s.Faqs)
                .Where(s => s.FreelancerId == freelancerId)
                .ToListAsync();

            services.ForEach(x => x.Packages = x.Packages.OrderBy(y => y.Cost).ToList());

            return services;
        }

        public async Task<Freelancer> LoginAsync(Freelancer freelancer)
        {
            var freelancerResponse = await _treffContext.Freelancers
                .Where(f => f.Mail == freelancer.Mail
                    && f.Password == freelancer.Password)
                .FirstOrDefaultAsync();


            return freelancerResponse;
        }

        public async Task<Freelancer> GetUserByPrinicipalAsync(string principal)
        {
            var freelancerResponse = await _treffContext.Freelancers
                .Where(f => f.IcpPrincipal == principal)
                .FirstOrDefaultAsync();

            if (freelancerResponse == null)
            {
                var newFreelancer = new Freelancer
                {
                    IcpPrincipal = principal,
                    Mail = principal,
                    Password = "123456",
                    Active = true,
                    Verified = true,
                    Invoice = false,
                    IsFreelancer = true,
                    ActiveDate = DateTime.Now,
                    Name = "",
                };
                await AddAsync(newFreelancer);
                return newFreelancer;
            }
            return freelancerResponse;
        }

        public async Task<Freelancer> LoginThirdPartyAsync(Freelancer freelancer)
        {
            var freelancerResponse = await _treffContext.Freelancers
                .Where(f => f.FacebookId == freelancer.FacebookId)
                .FirstOrDefaultAsync();

            if (freelancerResponse == null)
            {
                var response = await AddAsync(freelancer);
                return response;
            }

            return freelancerResponse;
        }

        public async Task<List<Education>> UpdateEducation(int freelancerId, List<Education> data)
        {
            var current = await _treffContext.Educations.Where(e => e.FreelancerId == freelancerId).ToListAsync();

            _treffContext.Educations.RemoveRange(current);

            await _treffContext.Educations.AddRangeAsync(data);

            await _treffContext.SaveChangesAsync();

            return data;
        }

        public async Task<List<Certification>> UpdateCertification(int freelancerId, List<Certification> data)
        {
            var current = await _treffContext.Certifications.Where(e => e.FreelancerId == freelancerId).ToListAsync();

            _treffContext.Certifications.RemoveRange(current);

            await _treffContext.Certifications.AddRangeAsync(data);

            await _treffContext.SaveChangesAsync();

            return data;
        }

        public async Task<List<Language>> UpdateLanguage(int freelancerId, List<Language> data)
        {
            var current = await _treffContext.Languages.Where(e => e.FreelancerId == freelancerId).ToListAsync();

            _treffContext.Languages.RemoveRange(current);

            await _treffContext.Languages.AddRangeAsync(data);

            await _treffContext.SaveChangesAsync();

            return data;
        }
        public async Task<bool> UpdateNotificationId(int freelancerId, string notificationId)
        {
            var current = await _treffContext.Freelancers
                .Where(e => e.Id == freelancerId)
                .FirstOrDefaultAsync();

            current.NotificationId = notificationId;

            _treffContext.Update(current);

            await _treffContext.SaveChangesAsync();

            return true;
        }
        public async Task<List<Freelancer>> GetAllAdminsAsync()
        {
            var admins = await _treffContext.Freelancers
                .Where(f => f.IsAdmin)
                .ToListAsync();

            return admins;
        }

    }
}
