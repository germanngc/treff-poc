using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using Application.Utils;

namespace Application.Features.MessageFeature.Commands
{
    public class SendHelpEmailCommand : IRequest<bool>
    {
        public bool IsFreelancer { get; set; }
        public string Name { get; set; }
        public string Subject { get; set; }
        public string Description { get; set; }
        public string Email { get; set; }

        public class SendHelpEmailCommandHandler : IRequestHandler<SendHelpEmailCommand, bool>
        {
            private readonly IMessageMailRepository _messageRepository;
            private readonly IAzureBlobService _azureBlobService;

            public SendHelpEmailCommandHandler(IMessageMailRepository messageRepository, IAzureBlobService azureBlobService)
            {
                _messageRepository = messageRepository;
                _azureBlobService = azureBlobService;
            }

            public async Task<bool> Handle(SendHelpEmailCommand request, CancellationToken cancellationToken)
            {
                var email = new EmailManger();

                var Subject = "Nuevo mensaje de soporte";

                var Description = @"<h1>Nombre: " + request.Name + "</h1>" +
                    "<p>Correo: " + request.Email + "</p>" +
                    "<p>Descripcion: " + request.Description + "</p>"+
                    (request.IsFreelancer ? "<p>Es freelancer</p>" : "<p>Es contratante</p>");

                // email.SendEmail(Description, "maxvazquezg@hotmail.com", Subject);
                email.SendEmail(Description, "hola.treff@gmail.com", Subject);

                return true;
            }
        }
    }
}
