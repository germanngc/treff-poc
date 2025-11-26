using Application.Interfaces.Repositories.Base;
using Microsoft.EntityFrameworkCore;
using Persistence.Context;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Persistence.Repositories.Base
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly treff_v2Context _treffContext;
        public Repository(treff_v2Context treffContext)
        {
            _treffContext = treffContext;
        }
        public async Task<T> AddAsync(T entity)
        {
            await _treffContext.Set<T>().AddAsync(entity);
            await _treffContext.SaveChangesAsync();
            return entity;
        }
        public async Task DeleteAsync(T entity)
        {
            _treffContext.Set<T>().Remove(entity);
            await _treffContext.SaveChangesAsync();
        }
        public async Task<IReadOnlyList<T>> GetAllAsync()
        {
            return await _treffContext.Set<T>().ToListAsync();
        }
        public async Task<T> GetByIdAsync(int id)
        {
            var entity = await _treffContext.Set<T>().FindAsync(id);
            if (entity != null)
            {
                _treffContext.Entry(entity).State = EntityState.Detached;
            }
            return entity;
        }
        public async Task<T> UpdateAsync(T entity)
        {
            _treffContext.Update(entity);
            await _treffContext.SaveChangesAsync();
            return entity as T;
        }

        public async Task<int> SaveChanges(T entity)
        {
            return await _treffContext.SaveChangesAsync();
        }
        //public void ClearContext()
        //{
        //    _treffContext.ChangeTracker.Clear();
        //}
    }
}
