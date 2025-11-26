using Application.Interfaces.Repositories.Base;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories
{
    public interface IMessageRepository : IRepository<ChatMessage>
    {
        Task<Chat> GetAllMessagesAsync(int userId, int freelancerId);
        Task<ChatMessage> SaveMessageAsync(string message, int userId, int chatId);
    }
}
