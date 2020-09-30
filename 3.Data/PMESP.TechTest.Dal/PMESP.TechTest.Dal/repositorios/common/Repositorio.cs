using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using PMESP.TechTest.Dal.querys;
using PMESP.TechTest.Dal.interfaces;
using Microsoft.Data.SqlClient;
using PMESP.TechTest.Dal.extensions;

namespace PMESP.TechTest.Dal.repositorios.common
{
    public class Repositorio<T> : IRepositorio<T> where T : class
    {

        /// <summary>
        /// The _table name
        /// </summary>
        private readonly string _tableName;

        private static IDbConnection _conn;

        /// <summary>
        /// Gets the connection.
        /// </summary>
        /// <value>
        /// The connection.
        /// </value>
        private static void Open()
        {
            _conn = QueryTool.GetConnection();
            _conn.Open();
        }

        private static void Close()
        {
            try
            {
                if (_conn.State != ConnectionState.Closed)
                {
                    _conn.Close();
                }
                _conn.Dispose();
            }
            catch
            {
                // ignored
            }
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="Repository{T}" /> class.
        /// </summary>
        /// <param name="tableName">Name of the table.</param>
        public Repositorio(string tableName)
        {
            _tableName = tableName;
        }

        /// <summary>
        /// Mapping the object to the insert/update columns.
        /// </summary>
        /// <param name="item">The item.</param>
        /// <returns>The parameters with values.</returns>
        /// <remarks>In the default case, we take the object as is with no custom mapping.</remarks>
        internal virtual dynamic Mapping(T item)
        {
            return item;
        }

        /// <summary>
        /// Adds the specified item.
        /// </summary>
        /// <param name="item">The item.</param>
        public virtual int Insert(T item)
        {
            Open();
            try
            {
                var parameters = (object)Mapping(item);
                return _conn.Insert<int>(_tableName, parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                Close();
            }

        }

        /// <summary>
        /// Adds the specified item.
        /// </summary>
        /// <param name="item">The item.</param>
        public virtual int Insert(string query, IEnumerable<T> ls)
        {
            Open();
            try
            {
                return _conn.Execute(query, ls);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                Close();
            }

        }

        /// <summary>
        /// Adds the specified item.
        /// </summary>
        /// <param name="item">The item.</param>
        public virtual long Insert(IEnumerable<T> ls)
        {
            Open();
            try
            {
                return _conn.Insert(ls);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                Close();
            }

        }

        public virtual void Update(string query, IEnumerable<T> ls)
        {
            Open();
            try
            {
                _conn.Execute(query, ls);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                Close();
            }

        }

        /// <summary>
        /// Updates the specified item.
        /// </summary>
        /// <param name="item">The item.</param>
        public virtual void Update(T item)
        {
            Open();
            try
            {
                //        foreach (var field in pessoa.GetType().GetProperties())
                //        {
                //            foreach (var fieldCopy in pessoaHistorico.GetType().GetProperties())
                //            {
                //                if (field.Name == fieldCopy.Name)
                //                    fieldCopy.SetValue(pessoaHistorico, field.GetValue(pessoa, null), null);
                //            }
                //        }

                var parameters = (object)Mapping(item);
                _conn.Update(_tableName, parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                Close();
            }
        }

        public virtual bool Update(IEnumerable<T> ls)
        {
            Open();
            try
            {
                return _conn.Update(ls);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                Close();
            }

        }

        /// <summary>
        /// Removes the specified item.
        /// </summary>
        /// <param name="item">The item.</param>
        public virtual void Delete(int id)
        {
            Open();
            try
            {
                _conn.Execute($"DELETE FROM {_tableName} WHERE Id = {id}");
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                Close();
            }
        }

        /// <summary>
        /// Removes the list
        /// </summary>
        /// <param name="item">The item.</param>
        public virtual void Delete(string query, IEnumerable<T> ls)
        {
            Open();
            try
            {
                _conn.Execute(query, ls);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                Close();
            }

        }

        /// <summary>
        /// Finds by ID.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <returns></returns>
        public virtual T GetById(int id)
        {
            T item = default(T);

            Open();
            try
            {
                item = _conn.Query<T>($"SELECT * FROM {_tableName} WHERE ID=@ID", new { ID = id }).SingleOrDefault();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                Close();
            }

            return item;
        }

        /// <summary>
        /// Finds the specified predicate.
        /// </summary>
        /// <param name="predicate">The predicate.</param>
        /// <returns>A list of items</returns>
        public virtual IEnumerable<T> Find(Expression<Func<T, bool>> predicate)
        {
            IEnumerable<T> items = null;

            // extract the dynamic sql query and parameters from predicate
            QueryResult result = DynamicQuery.GetDynamicQuery(_tableName, predicate);

            Open();

            try
            {
                items = _conn.Query<T>(result.Sql, (object)result.Param);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                Close();
            }

            return items;
        }

        /// <summary>
        /// Finds all.
        /// </summary>
        /// <returns>All items</returns>
        public virtual IEnumerable<T> GetAll()
        {
            IEnumerable<T> items = null;

            Open();

            try
            {
                items = _conn.Query<T>($"SELECT * FROM {_tableName}");
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                Close();
            }

            return items;
        }

        /// <summary>
        /// Finds all.
        /// </summary>
        /// <returns>All items</returns>
        public virtual int MaxTable(T tb)
        {
            var item = 0;

            Open();

            try
            {

                item = _conn.Query<int>($"SELECT {ToolDataBase.FieldMax(tb)} FROM {_tableName}").ToList().FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                Close();
            }

            return item;
        }
        /// <summary>
        /// Adds the specified item.
        /// </summary>
        /// <param name="item">The item.</param>
        public virtual void ExecProcedure(string procName, List<SqlParameter> parameters)
        {
            Open();
            try
            {
                var parameter = new DynamicParameters();

                foreach (var item in parameters)
                {
                    if (item.SqlDbType != SqlDbType.Structured)
                        parameter.Add(item.ParameterName, item.Value);
                    else {
                        var dt = item.Value as DataTable;
                        parameter.Add(item.ParameterName, dt.AsTableValuedParameter());
                    }
                }

                _conn.Execute(procName, parameter, commandType: CommandType.StoredProcedure);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                Close();
            }

        }
    }
}
