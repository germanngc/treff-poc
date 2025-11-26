using System.Threading.Tasks;

namespace WebApi.Hubs
{
    public interface IChatClient
    {
        Task ReceiveMessage(ChatMessage message);
    }
}
