using Application.Interfaces;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Application.Mapper;
using Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.ServiceFeatures.Commands
{
    public class EditServiceCommand : IRequest<int>
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public int CategoryId { get; set; }
        public int CategoryMainId { get; set; }

        public string KeyWords { get; set; }

        public string Description { get; set; }

        public string MainImage { get; set; }
        public ICollection<Package> Packages { get; set; }
        public ICollection<Faq> Faqs { get; set; }

        public int FreelancerId { get; set; }
        public bool Highlight { get; set; } = false;

        public bool ExpressDelivery { get; set; } = false;
        public string Requirements { get; set; }
        public List<FileModel> Files { get; set; }
        public class EditServiceCommandHandler : IRequestHandler<EditServiceCommand, int>
        {
            private readonly IServiceRepository _context;
            private readonly IAzureBlobService _contextStorage;
            public EditServiceCommandHandler(IServiceRepository context, IAzureBlobService contextStorage)
            {
                _context = context;
                _contextStorage = contextStorage;
            }
            public async Task<int> Handle(EditServiceCommand command, CancellationToken cancellationToken)
            {
                var serviceEntitiy = ServiceMapper.Mapper.Map<Service>(command);

                serviceEntitiy.ServiceImages = new List<ServiceImage>();

                foreach (var formFile in command.Files)
                {
                    var serviceImage = new ServiceImage();
                    var split = formFile.File.Split(',');
                    var base64Data = split.Length > 1 ? split[1] : formFile.File;
                    if (_contextStorage.IsBase64String(base64Data))
                    {
                        Guid guid = Guid.NewGuid();
                        var base64 = formFile.File;
                        //var split = base64.Split(',');
                        //base64 = split.Length > 1 ? split[1] : base64;
                        //var path = AppDomain.CurrentDomain.BaseDirectory + @"Images\";
                        var name = guid.ToString() + formFile.FileName;

                        //File.WriteAllBytes(path + name, Convert.FromBase64String(base64));
                        var resp = await _contextStorage.UploadFileAsync(base64, name);
                        serviceImage.Image = resp;
                        serviceEntitiy.ServiceImages.Add(serviceImage);
                    }
                    else
                    {
                        serviceImage.ServiceId = command.Id;
                        serviceImage.Image = formFile.FileName;
                        serviceEntitiy.ServiceImages.Add(serviceImage);
                    }

                }
                serviceEntitiy.MainImage = "";
                await _context.DeleteImagesServiceByIdAsync(command.Id);
                await _context.DeleteFaqsServiceByIdAsync(command.Id);

                var response = await _context.UpdateAsync(serviceEntitiy);
                return response.Id;
            }
        }
    }
}
