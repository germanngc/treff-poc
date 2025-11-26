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
    public class ValidateCodeFreelancerCommand : IRequest<BasicResponse>
    {
        public int Id { get; set; }
        public string Value { get; set; }
        public string Code { get; set; }
        public class ValidateCodeFreelancerCommandHandler : IRequestHandler<ValidateCodeFreelancerCommand, BasicResponse>
        {
            private readonly IFreelancerRepository _context;
            private readonly IFreelancerVerificationRepository _contextVerification;
            private readonly ITwilioService _contextTwilio;
            public ValidateCodeFreelancerCommandHandler(IFreelancerRepository context,
                ITwilioService contextTwilio,
                IFreelancerVerificationRepository contextVerification)
            {
                _context = context;
                _contextTwilio = contextTwilio;
                _contextVerification = contextVerification;
            }
            public async Task<BasicResponse> Handle(ValidateCodeFreelancerCommand request, CancellationToken cancellationToken)
            {
                var response = new BasicResponse();

                var validation = await _contextVerification.GetValidationByFreelancerId(request.Id, request.Value, request.Code);

                if (validation != null)
                {
                    validation.Verificated = true;
                    await _contextVerification.UpdateAsync(validation);

                    response.Success = true;
                    response.Message = "Validado correctamente";
                    return response;
                }
                else{
                    response.Success = false;
                    response.Message = "Error en la validación, verifique el codigo recibido";
                }

                return response;
            }
        }
    }
}
