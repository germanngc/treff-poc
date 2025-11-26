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
    public class SetViewServiceCommand : IRequest<int>
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public class SetViewServiceCommandHandler : IRequestHandler<SetViewServiceCommand, int>
        {
            private readonly IServiceRepository _context;
            private readonly IAzureBlobService _contextStorage;
            public SetViewServiceCommandHandler(IServiceRepository context, IAzureBlobService contextStorage)
            {
                _context = context;
                _contextStorage = contextStorage;
            }
            public async Task<int> Handle(SetViewServiceCommand command, CancellationToken cancellationToken)
            {
                var serviceViewEntitiy = new ServiceView();
                serviceViewEntitiy.ServiceId = command.Id;
                serviceViewEntitiy.UserId = command.UserId;
                serviceViewEntitiy.Date = DateTime.Now;
                var response = await _context.AddViewAsync(serviceViewEntitiy);
                return response;
            }
        }
    }
}
