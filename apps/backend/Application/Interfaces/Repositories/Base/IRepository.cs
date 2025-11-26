using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories.Base
{
    public interface IRepository<T> where T : class
    {
        Task<IReadOnlyList<T>> GetAllAsync();
        Task<T> GetByIdAsync(int id);
        Task<T> AddAsync(T entity);
        Task<T> UpdateAsync(T entity);
        Task DeleteAsync(T entity);
        Task<int> SaveChanges(T entity);
        //void ClearContext();
    }
}
