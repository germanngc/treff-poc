using Application.Interfaces;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Application.Mapper;
using Application.Models;
using Application.Utils;
using Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using static Twilio.Rest.Api.V2010.Account.Call.FeedbackSummaryResource;

namespace Application.Features.FreelancerFeatures.Commands
{
    public class ValidateSmsFreelancerCommand : IRequest<BasicResponse>
    {
        public int Id { get; set; }
        public string Phone { get; set; }
        public class ValidateSmsFreelancerCommandHandler : IRequestHandler<ValidateSmsFreelancerCommand, BasicResponse>
        {
            private readonly IFreelancerRepository _context;
            private readonly IFreelancerVerificationRepository _contextVerification;
            private readonly ITwilioService _contextTwilio;
            public ValidateSmsFreelancerCommandHandler(IFreelancerRepository context,
                ITwilioService contextTwilio,
                IFreelancerVerificationRepository contextVerification)
            {
                _context = context;
                _contextTwilio = contextTwilio;
                _contextVerification = contextVerification;
            }
            public async Task<BasicResponse> Handle(ValidateSmsFreelancerCommand request, CancellationToken cancellationToken)
            {
                var freelancerEntitiy = await _context.GetByIdAsync(request.Id);

                var response = new BasicResponse();
                response.Success = true;

                var verificationCode = CodeGenerator.GenerateSecurityCode();

                var verificationEntity = new FreelancerVerification
                {
                    Code = verificationCode,
                    FreelancerId = freelancerEntitiy.Id,
                    Type = "Sms",
                    Value = request.Phone,
                };

                await _contextVerification.AddAsync(verificationEntity);

                var responseSms = _contextTwilio.SendMessage(request.Phone, 
                    $"Utiliza el codigo {verificationCode} para verificar tu cuenta en TREFF");

                if (responseSms.Status == StatusEnum.Failed)
                {
                    response.Success = false;
                    response.Message = responseSms.ErrorMessage;
                }

                return response;
            }
        }
    }
}
