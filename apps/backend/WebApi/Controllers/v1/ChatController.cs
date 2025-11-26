using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Features.CategoryFeatures.Queries;
using Application.Features.ChatFeatures.Commands;
using Application.Features.ProjectFeatures.Commands;
using Application.Features.ProjectFeatures.Queries;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using WebApi.Hubs;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace WebApi.Controllers.v1
{
    [ApiVersion("1.0")]
    public class ChatController : BaseApiController
    {
        private readonly IHubContext<ChatHub> _chatHub;
        private readonly IHubContext<MessageHub> _messageHub;

        public ChatController(IHubContext<ChatHub> chatHub, IHubContext<MessageHub> messageHub)
        {
            _chatHub = chatHub;
            _messageHub = messageHub;
        }

        //[HttpPost("messages")]
        //public async Task Post(ChatMessage message)
        //{
        //    // run some logic...

        //    await _chatHub.Clients.All.ReceiveMessage(message);
        //}

        [HttpPost("add")]
        public async Task Add(ChatMessage message)
        {
            message.Message = "se conectó al chat";
            await _chatHub.Clients.Group(message.Group.ToString())
                .SendAsync("UsersAdded", message);
            // run some logic...

            //await _chatHub.Clients.Group(message.Group).SendAsync("", message);
        }
        [HttpPost("messages")]
        public async Task Post(ChatMessage message)
        {
            var request = new SaveChatMessageCommand();
            request.UserId = message.UserId;
            request.Message = message.Message;
            request.ChatId = message.ChatId;
            request.ToUserId = message.ToUserId;
            var response = await Mediator.Send(request);

            //await _chatHub.Clients.Group(message.Group.ToString())
            //    .SendAsync("UsersAdded", message);
            //// run some logic...

            ////await _chatHub.Clients.Group(message.Group).SendAsync("", message);
            ///
            await _messageHub.Clients.Client(response.ConnectionId.ToString())
                .SendAsync("ReceiveChatMessage", response.ChatMessage);
        }

        [HttpPost("getChat")]
        public async Task<IActionResult> GetChat(GetOrCreateChatCommand command)
        {
            return Ok(await Mediator.Send(command));
        }
    }
}