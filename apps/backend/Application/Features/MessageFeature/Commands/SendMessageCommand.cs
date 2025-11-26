using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Threading;

namespace Application.Features.MessageFeature.Commands
{
    public class SendMessageCommand : IRequest<Message>
    {
        public int FreelancerId { get; set; }
        public int UserId { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public string FileName { get; set; }
        public string FileData { get; set; }

        public class SendMessageCommandHandler : IRequestHandler<SendMessageCommand, Message>
        {
            private readonly IMessageMailRepository _messageRepository;
            private readonly IAzureBlobService _azureBlobService;

            public SendMessageCommandHandler(IMessageMailRepository messageRepository, IAzureBlobService azureBlobService)
            {
                _messageRepository = messageRepository;
                _azureBlobService = azureBlobService;
            }

            public async Task<Message> Handle(SendMessageCommand request, CancellationToken cancellationToken)
            {
                var message = new Message
                {
                    FreelancerId = request.FreelancerId,
                    UserId = request.UserId,
                    Subject = request.Subject,
                    Body = request.Body,
                    SentDateTime = DateTime.Now
                };

                // Agregar adjunto si existe
                if (!string.IsNullOrEmpty(request.FileName) && request.FileData != null)
                {
                    // Subir el archivo a Azure Blob Storage
                    string fileUrl = await _azureBlobService.UploadFileAsync(request.FileData, request.FileName);

                    var attachment = new Attachment
                    {
                        FileName = fileUrl,
                        
                    };

                    message.Attachments = new List<Attachment> { attachment };
                }

                return await _messageRepository.CreateMessage(message);
            }
        }
    }
}
