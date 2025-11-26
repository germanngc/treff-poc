using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace WebApi.Hubs
{
    public class MessageHub : Hub
    {
        public async Task SendChatMessage(string message, string connectionId)
        {
            await Clients.Client(connectionId).SendAsync("ReceiveChatMessage", message);
        }
        public string GetConnectionId() => Context.ConnectionId;
    }
}
