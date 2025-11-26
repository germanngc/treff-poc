using Application.Interfaces.Repositories;
using Domain.Entities;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.FreelancerFeatures.Queries
{
    public class GetAllAdminsQuery : IRequest<IEnumerable<Freelancer>>
    {
        public class GetAllAdminsQueryHandler : IRequestHandler<GetAllAdminsQuery, IEnumerable<Freelancer>>
        {
            private readonly IFreelancerRepository _context;
            public GetAllAdminsQueryHandler(IFreelancerRepository context)
            {
                _context = context;
            }
            public async Task<IEnumerable<Freelancer>> Handle(GetAllAdminsQuery query, CancellationToken cancellationToken)
            {
                var serviceList = await _context.GetAllAdminsAsync();
                if (serviceList == null)
                {
                    return null;
                }
                return serviceList.AsReadOnly();
            }
        }
    }
}
