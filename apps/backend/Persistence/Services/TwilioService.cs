using Application.Interfaces.Services;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;
using Twilio;
using Twilio.Rest.Api.V2010.Account;

namespace Persistence.Services
{
    public class TwilioService: ITwilioService
    {
        private readonly TwilioConfig _twilioConfig = null;

        public TwilioService(IOptions<TwilioConfig> twilioConfig)
        {
            _twilioConfig = twilioConfig.Value;
        }
        public MessageResource SendMessage(string phoneNumber, string messageBody)
        {
            TwilioClient.Init(_twilioConfig.AccountSid, _twilioConfig.AuthToken);

            var message = MessageResource.Create(
                body: messageBody,
                from: new Twilio.Types.PhoneNumber(_twilioConfig.Phone),
                to: new Twilio.Types.PhoneNumber(phoneNumber)
            );
            return message;
        }
    }
}
