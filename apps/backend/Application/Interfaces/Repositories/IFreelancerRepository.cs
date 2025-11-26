using Application.Interfaces.Repositories.Base;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories
{
    public interface IFreelancerRepository : IRepository<Freelancer>
    {
        Task<Freelancer> GetFreelancerByIdAsync(int freelancerId);
        Task<List<Service>> GetAllServicesByFreelancerIdAsync(int freelancerId);
        Task<Freelancer> LoginAsync(Freelancer freelancer);
        Task<List<Education>> UpdateEducation(int freelancerId, List<Education> data);
        Task<List<Certification>> UpdateCertification(int freelancerId, List<Certification> data);
        Task<List<Language>> UpdateLanguage(int freelancerId, List<Language> data);
        Task<bool> UpdateNotificationId(int freelancerId, string notificationId);
        Task<Freelancer> LoginThirdPartyAsync(Freelancer freelancer);
        Task<List<Freelancer>> GetAllAdminsAsync();
        Task<Freelancer> GetUserByPrinicipalAsync(string principal);
    }
}
