using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace PMESP.TechTest.Dal.interfaces
{
    public interface IRepositorio<T> where T: class
    {
        T GetById(int Id);
        IEnumerable<T> GetAll();
        IEnumerable<T> Find(Expression<Func<T, bool>> predicate);
        int Insert(T entity);
        long Insert(IEnumerable<T> ls);
        int Insert(string query, IEnumerable<T> ls);
        void Delete(int Id);
        void Delete(string query, IEnumerable<T> ls);
        void Update(T entity);
        void Update(string query, IEnumerable<T> ls);
        bool Update(IEnumerable<T> ls);
        int MaxTable(T tb);
        void ExecProcedure(string procName, List<SqlParameter> parameters);
    }
}
