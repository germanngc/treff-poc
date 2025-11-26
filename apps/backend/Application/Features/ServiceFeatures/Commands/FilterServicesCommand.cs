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
    public class FilterServicesCommand : IRequest<List<Service>>
    {
        public string ServiceName { get; set; }
        public bool ByService { get; set; }
        public int CategoryId { get; set; }
        public bool? ExpressDelivery { get; set; }
        public int FilterOption { get; set; }
        public bool? Verified { get; set; }
        public bool? Invoice { get; set; }

        public class FilterServicesCommandHandler : IRequestHandler<FilterServicesCommand, List<Service>>
        {
            private readonly IServiceRepository _context;
            private readonly IAzureBlobService _contextStorage;
            public FilterServicesCommandHandler(IServiceRepository context, IAzureBlobService contextStorage)
            {
                _context = context;
                _contextStorage = contextStorage;
            }
            public async Task<List<Service>> Handle(FilterServicesCommand command, CancellationToken cancellationToken)
            {
                var response = await _context.FilterServicesAsync(command.ServiceName, command.ByService, command.CategoryId, command.ExpressDelivery, command.Verified, command.Invoice, command.FilterOption);
                return response;
            }
        }
    }
}
