using Application.Interfaces;
using Application.Interfaces.Repositories;
using Application.Mapper;
using Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.FreelancerFeatures.Commands
{
    public class UpdateFreelancerLanguageCommand : IRequest<List<Language>>
    {
        public List<Language> languages { get; set; }
        public int Id { get; set; }
        public class UpdateFreelancerLanguageCommandHandler : IRequestHandler<UpdateFreelancerLanguageCommand, List<Language>>
        {
            private readonly IFreelancerRepository _context;
            public UpdateFreelancerLanguageCommandHandler(IFreelancerRepository context)
            {
                _context = context;
            }
            public async Task<List<Language>> Handle(UpdateFreelancerLanguageCommand request, CancellationToken cancellationToken)
            {
                var data = await _context.UpdateLanguage(request.Id, request.languages);

                return data;
            }
        }
    }
}
