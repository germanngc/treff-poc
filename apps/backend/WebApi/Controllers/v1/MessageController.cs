using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Features.FreelancerFeatures.Commands;
using Application.Features.FreelancerFeatures.Queries;
using Application.Features.MessageFeature.Commands;
using Application.Features.MessageFeature.Queries;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers.v1
{
    [ApiVersion("1.0")]
    public class MessageController : BaseApiController
    {
        [HttpGet("freelancer/{freelancerId}")]
        public async Task<ActionResult<List<Message>>> GetMessagesByFreelancerId(int freelancerId)
        {
            var query = new GetMessagesByFreelancerIdQuery { FreelancerId = freelancerId };
            var messages = await Mediator.Send(query);
            return Ok(messages);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<Message>>> GetMessagesByUserId(int userId)
        {
            var query = new GetMessagesByUserIdQuery { UserId = userId };
            var messages = await Mediator.Send(query);
            return Ok(messages);
        }

        [HttpPost]
        public async Task<ActionResult<Message>> SendMessage(SendMessageCommand command)
        {
            var message = await Mediator.Send(command);
            return Ok(message);
        }

        [HttpGet("between/{userId}/{otherUserId}")]
        public async Task<IActionResult> GetAllMessages(int userId, int otherUserId)
        {
            var query = new GetAllMessagesQuery { UserId = userId, OtherUserId = otherUserId };
            var messages = await Mediator.Send(query);
            return Ok(messages);
        }

        [HttpGet("users/{userId}")]
        public async Task<ActionResult> FetchUserData(int userId)
        {
            var query = new FetchUserDataQuery { UserId = userId };
            var userData = await Mediator.Send(query);
            return Ok(userData);
        }
        [HttpPost("help")]
        public async Task<ActionResult> SendEmail(SendHelpEmailCommand command)
        {
            var response = await Mediator.Send(command);
            return Ok(response);
        }
    }
}