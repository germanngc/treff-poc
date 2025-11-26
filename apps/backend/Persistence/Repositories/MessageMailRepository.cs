using Application.Interfaces.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Persistence.Context;
using Persistence.Repositories.Base;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Linq;

namespace Persistence.Repositories
{
    public class MessageMailRepository : Repository<Message>, IMessageMailRepository
    {
        public MessageMailRepository(treff_v2Context treffContext) : base(treffContext) { }

        public async Task<List<Message>> GetMessagesByFreelancerId(int freelancerId)
        {
            return await _treffContext.Messages
                .Include(m => m.Attachments)
                .Where(m => m.FreelancerId == freelancerId)
                .ToListAsync();
        }

        public async Task<List<Message>> GetMessagesByUserId(int userId)
        {
            return await _treffContext.Messages
                .Include(m => m.Attachments)
                .Where(m => m.UserId == userId)
                .ToListAsync();
        }

        public async Task<Message> CreateMessage(Message message)
        {
            _treffContext.Messages.Add(message);
            await _treffContext.SaveChangesAsync();

            return message;
        }

        public async Task<List<Message>> GetAllMessagesByUserId(int userId, int otherUserId)
        {
            return await _treffContext.Messages
                .Include(m => m.Attachments)
                .Where(m => (m.UserId == userId && m.FreelancerId == otherUserId)
                    || (m.UserId == otherUserId && m.FreelancerId == userId))
                .ToListAsync();
        }

        public async Task<List<Freelancer>> GetUsersWithMessages(int userId)
        {
            var users = await _treffContext.Messages
                .Where(m => m.UserId == userId || m.FreelancerId == userId)
                .Select(u => u.FreelancerId == userId ? u.User : u.Freelancer)
                .ToListAsync();

            return users
                .GroupBy(u => u.Id)
                .Select(g => g.First())
                .ToList();

        }
    }
}
