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
    public class FreelancerVerificationRepository : Repository<FreelancerVerification>, IFreelancerVerificationRepository
    {
        public FreelancerVerificationRepository(treff_v2Context treffContext) : base(treffContext) { }

        public async Task<FreelancerVerification> GetValidationByFreelancerId(int freelancerId, string phoneNumber, string code)
        {
            var response = await _treffContext
                .FreelancerVerifications
                .Where(v => v.FreelancerId == freelancerId &&
                    v.Value == phoneNumber &&
                    v.Code == code)
                .FirstOrDefaultAsync();

            return response;
        }

    }
}
