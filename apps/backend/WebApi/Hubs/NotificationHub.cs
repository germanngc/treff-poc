using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace WebApi.Hubs
{
    public class NotificationHub : Hub
    {
        public async Task SendNotification(string message, string connectionId)
        {
            await Clients.Client(connectionId).SendAsync("ReceiveNotification", message);
        }
        public string GetConnectionId() => Context.ConnectionId;
    }

    public class NotificationMessage
    {
        public string UserId { get; set; }
        public string Message { get; set; }
        public string Url { get; set; }
    }
}
