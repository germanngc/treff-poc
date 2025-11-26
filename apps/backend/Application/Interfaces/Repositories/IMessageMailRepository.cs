using Application.Interfaces.Repositories.Base;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories
{
    public interface IMessageMailRepository : IRepository<Message>
    {
        Task<List<Message>> GetMessagesByFreelancerId(int freelancerId);
        Task<List<Message>> GetMessagesByUserId(int userId);
        Task<Message> CreateMessage(Message message);
        Task<List<Message>> GetAllMessagesByUserId(int userId, int otherUserId);
        Task<List<Freelancer>> GetUsersWithMessages(int userId);
    }
}
