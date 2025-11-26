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
using Openpay;
using Openpay.Entities;
using Openpay.Entities.Request;
//using Openpay.Exceptions;

namespace Application.Features.ProjectFeatures.Commands
{
    public class CreateProjectCommand : IRequest<int>
    {
        public int FreelancerId { get; set; }
        public int UserId { get; set; }
        public int ServiceId { get; set; }
        public int PackageId { get; set; }
        public string DeviceSessionId { get; set; }
        public string CardNumber { get; set; }
        public string HolderName { get; set; }
        public string Email { get; set; }
        public string ExpirationMonth { get; set; }
        public string ExpirationYear { get; set; }
        public string Cvv2 { get; set; }
        public class CreateProjectCommandHandler : IRequestHandler<CreateProjectCommand, int>
        {
            private readonly IProjectRepository _context;
            private readonly IServiceRepository _contextService;
            public CreateProjectCommandHandler(IProjectRepository context,
                IServiceRepository contextService)
            {
                _context = context;
                _contextService = contextService;
            }
            public async Task<int> Handle(CreateProjectCommand command, CancellationToken cancellationToken)
            {
                // Replace with your API keys
                string merchantId = "mtxusmriuuvmydfrzozh";
                string apiKey = "sk_3cebad6306e14218adece6cd458e9d4f";
                bool isProduction = false; // use true for production
                var transactonId = ""; // use true for production

                // Create OpenPay API object
                OpenpayAPI openpayApi = new OpenpayAPI(apiKey, merchantId, isProduction);

                // Create card object
                Card card = new Card();
                card.CardNumber = command.CardNumber;
                card.HolderName = command.HolderName;
                card.ExpirationMonth = command.ExpirationMonth;
                card.ExpirationYear = command.ExpirationYear;
                card.Cvv2 = command.Cvv2;

                var projectEntitiy = ProjectMapper.Mapper.Map<Project>(command);
                var service = await _contextService.GetServiceByIdAsync(command.ServiceId);
                var package = service.Packages.Where(p => p.Id == command.PackageId).FirstOrDefault();

                //try
                //{
                    ChargeRequest charge = new ChargeRequest();
                    var cardResponse = openpayApi.CardService.Create(card);
                    // Create charge object
                    charge.Method = "card";
                    charge.Amount = (decimal)package.Cost;
                    charge.Description = "TREF - " + service.Name;
                    charge.DeviceSessionId = command.DeviceSessionId;
                    charge.Customer = new Customer();
                    charge.Customer.Name = command.HolderName;
                    charge.Customer.Email = command.Email;
                    charge.SourceId = cardResponse.Id;
                    //charge.Card = card;
                    // Charge the card
                    var responseCharge = openpayApi.ChargeService.Create(charge);
                    //Console.WriteLine("Charge successful. Charge Id: " + responseCharge.Id);
                    transactonId = responseCharge.Id;
                //}
                //catch (OpenpayException ex)
                //{
                //    Console.WriteLine("OpenPay error: " + ex.Message);
                //    return 0;
                //}


                projectEntitiy.CreationDate = DateTime.Now;
                projectEntitiy.CalculatedFinishDate = DateTime.Now.AddDays(package.Time);
                projectEntitiy.Price = package.Cost;
                projectEntitiy.Finished = false;
                projectEntitiy.Status = Status.Active;
                projectEntitiy.ChatId = Guid.NewGuid().ToString();
                projectEntitiy.TransactionId = transactonId;

                var response = await _context.AddAsync(projectEntitiy);
                return response.Id;
            }
        }
    }
}
