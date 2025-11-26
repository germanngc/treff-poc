using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace WebApi.Hubs
{
    /// <summary>
    /// Chat hub
    /// </summary>
    public class ChatHub : Hub
    {
        /// <inheritdoc/>
        //public async Task SendMessageAsync(ChatMessage message)
        //{
        //    await Clients.Group(message.Group).ReceiveMessage(message);
        //}
        //public async override Task OnConnectedAsync()
        //{
        //    await base.OnConnectedAsync();
        //    await Clients.Caller.SendAsync("Message", "Connected successfully!");
        //}

        //public async Task SubscribeToBoard(Guid boardId)
        //{
        //    await Groups.AddToGroupAsync(Context.ConnectionId, boardId.ToString());
        //    await Clients.Caller.SendAsync("Message", "Added to board successfully!");
        //}
        public async override Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            await Clients.Caller.SendAsync("Message", "Connected successfully!");
        }

        public async Task SubscribeToBoard(string boardId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, boardId);
            await Clients.Caller.SendAsync("Message", "Added to board successfully!");
        }
    }

    public class ChatMessage
    {
        public string User { get; set; }
        public int UserId { get; set; }
        public int ToUserId { get; set; }
        public int ChatId { get; set; }

        public string Message { get; set; }
        public string Group { get; set; }
    }
}
