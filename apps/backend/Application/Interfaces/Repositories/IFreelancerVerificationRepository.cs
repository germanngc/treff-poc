using Application.Interfaces.Repositories.Base;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories
{
    public interface IFreelancerVerificationRepository : IRepository<FreelancerVerification>
    {
        Task<FreelancerVerification> GetValidationByFreelancerId(int freelancerId, string phoneNumber, string code);
    }
}
