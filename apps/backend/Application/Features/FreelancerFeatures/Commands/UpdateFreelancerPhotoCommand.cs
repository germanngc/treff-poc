using Application.Interfaces;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
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
    public class UpdateFreelancerPhotoCommand : IRequest<Freelancer>
    {
        public int Id { get; set; }
        public string Photo { get; set; }
        public string FileName { get; set; }
        public bool Profile { get; set; } 
        public bool Cover { get; set; }

        public class UpdateFreelancerPhotoCommandHandler : IRequestHandler<UpdateFreelancerPhotoCommand, Freelancer>
        {
            private readonly IFreelancerRepository _context;
            private readonly IAzureBlobService _contextStorage;
            public UpdateFreelancerPhotoCommandHandler(IFreelancerRepository context, IAzureBlobService contextStorage)
            {
                _context = context;
                _contextStorage = contextStorage;
            }
            public async Task<Freelancer> Handle(UpdateFreelancerPhotoCommand request, CancellationToken cancellationToken)
            {
                var freelancerEntitiy = await _context.GetByIdAsync(request.Id);

                if (freelancerEntitiy == null)
                {
                    throw new Exception();
                }

                Guid guid = Guid.NewGuid();
                var base64 = request.Photo;
                var name = guid.ToString() + request.FileName;

                var resp = await _contextStorage.UploadFileAsync(base64, name);

                if (request.Profile)
                {
                    freelancerEntitiy.Photo = resp;
                }
                if (request.Cover)
                {
                    freelancerEntitiy.Cover = resp;
                }

                await _context.UpdateAsync(freelancerEntitiy);

                freelancerEntitiy = await _context.GetFreelancerByIdAsync(request.Id);
                return freelancerEntitiy;
            }
        }
    }
}
