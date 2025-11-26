using Application.Interfaces.Repositories;
using Domain.Entities;
using Persistence.Context;
using Persistence.Repositories.Base;
using System;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Persistence.Repositories
{
    public class MessageRepository : Repository<ChatMessage>, IMessageRepository
    {
        public MessageRepository(treff_v2Context treffContext) : base(treffContext) { }
        public async Task<Chat> GetAllMessagesAsync(int userId, int freelancerId)
        {
            var chat = await _treffContext.Chats
                .Where(c => (c.UserId == userId &&
                    c.FreelancerId == freelancerId) ||
                    (c.UserId == freelancerId &&
                    c.FreelancerId == userId))
                .Include(c => c.ChatMessages)
                .ThenInclude(m => m.User)
                .FirstOrDefaultAsync();

            if (chat == null)
            {
                var newChat = new Chat()
                {
                    UserId = userId,
                    FreelancerId = freelancerId,
                    Created = DateTime.Now,
                    Identifier = Guid.NewGuid().ToString(),
                };
                _treffContext.Add(newChat);
                await _treffContext.SaveChangesAsync();
                chat = newChat;
            }

            return chat;
        }

        public async Task<ChatMessage> SaveMessageAsync(string message, int userId, int chatId)
        {

            var chatMessage = new ChatMessage()
            {
                UserId = userId,
                ChatId = chatId,
                Date = DateTime.Now,
                Message = message,
            };
            _treffContext.Add(chatMessage);
            await _treffContext.SaveChangesAsync();

            return chatMessage;
        }
    }
}
