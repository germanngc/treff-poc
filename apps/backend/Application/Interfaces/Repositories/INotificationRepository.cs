using Application.Interfaces.Repositories.Base;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories
{
    public interface INotificationRepository : IRepository<Notification>
    {
        Task<IEnumerable<Notification>> GetNotificationByFreelancerIdAsync(int freelancerId, bool onlyUnread);
        Task<IEnumerable<Notification>> GetNotificationByFreelancerIdAsync(int freelancerId);
        Task<IEnumerable<Notification>> ClearNotificationsByFreelancerIdAsync(int freelancerId);
        Task<Notification> GetNotificationByIdAsync(int id);
    }
}
