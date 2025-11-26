using Application.Interfaces.Repositories;
using Domain.Entities;
using Persistence.Context;
using Persistence.Repositories.Base;
using System;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Models;

namespace Persistence.Repositories
{
    public class ProjectRepository : Repository<Project>, IProjectRepository
    {
        public ProjectRepository(treff_v2Context treffContext) : base(treffContext) { }

        public async Task<IEnumerable<Project>> GetActiveByFreelancerIdAsync(int freelancerId, int status)
        {
            return await _treffContext.Projects
                .Include(p => p.Freelancer)
                .Include(p => p.User)
                .Include(p => p.Package)
                .Include(p => p.Service)
                .ThenInclude(s => s.Category)
                .Where(p => p.FreelancerId == freelancerId &&
                    p.Status == (Status)status)
                .ToListAsync();
        }

        public async Task<IEnumerable<Project>> GetActiveByUserIdAsync(int userId, int status)
        {
            return await _treffContext.Projects
                .Include(p => p.Freelancer)
                .Include(p => p.User)
                .Include(p => p.Package)
                .Include(p => p.Service)
                .ThenInclude(s => s.Category)
                .Where(p => p.UserId == userId &&
                    p.Status == (Status)status)
                .ToListAsync();
        }

        public async Task<Project> GetActiveByIdAsync(int id)
        {
            return await _treffContext.Projects
                .Include(p => p.Freelancer)
                .Include(p => p.User)
                .Include(p => p.Package)
                .Include(p => p.Service)
                .ThenInclude(s => s.Category)
                .Where(p => p.Id == id)
                .FirstOrDefaultAsync();
        }

        public async Task<List<Project>> GetProjectsGroupedByUserId(int freelancerId)
        {
            var projects = await (_treffContext.Projects
                .Include(p => p.Freelancer)
                .Include(p => p.User)
                .Include(p => p.Service)
                .Include(p => p.Package)
                .Where(p => p.UserId == freelancerId)
                .ToListAsync());

            return projects;
        }

        public async Task<ProjectAndViewsResponse> GetProjectsAndViewsByUserId(int freelancerId)
        {

            var projects = await (_treffContext.Projects
                .Include(p => p.Freelancer)
                .Include(p => p.User)
                .Include(p => p.Service)
                .Include(p => p.Package)
                .Where(p => p.UserId == freelancerId)
                .ToListAsync());

            var views = await (_treffContext.Services
                .Include(v => v.Views)
                .Where(v => v.FreelancerId == freelancerId)
                .Select(s => s.Views.Count)
                .ToListAsync());

            var response = new ProjectAndViewsResponse()
            {
                projects = projects.Count,
                views = views.Sum(views => views)
            };

            return response;
        }

    }
}
