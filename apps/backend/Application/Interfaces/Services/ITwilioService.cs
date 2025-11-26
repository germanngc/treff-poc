using System;
using System.Collections.Generic;
using System.Text;
using Twilio.Rest.Api.V2010.Account;

namespace Application.Interfaces.Services
{
    public interface ITwilioService
    {
        MessageResource SendMessage(string phoneNumber, string messageBody);
    }
}
