using Application.Interfaces.Repositories.Base;
using Application.Models;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories
{
    public interface IProjectRepository : IRepository<Project>
    {
        Task<IEnumerable<Project>> GetActiveByFreelancerIdAsync(int freelancerId, int status);
        Task<IEnumerable<Project>> GetActiveByUserIdAsync(int userId, int status);
        Task<Project> GetActiveByIdAsync(int id);
        Task<List<Project>> GetProjectsGroupedByUserId(int freelancerId);
        Task<ProjectAndViewsResponse> GetProjectsAndViewsByUserId(int freelancerId);
    }
}
