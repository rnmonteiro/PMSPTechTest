using Dapper;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace PMESP.TechTest.Dal.extensions
{
    public static class DapperExtensions
    {
        public static T Insert<T>(this IDbConnection cnn, string tableName, dynamic param, bool identity = false)
        {
            identity = param.GetType().GetProperty("Id").GetValue(param, null) > 0;

            IEnumerable<T> result = SqlMapper.Query<T>(cnn, DynamicQuery.GetInsertQuery(tableName, param, identity), param);
            return result.First();
        }

        public static void Update(this IDbConnection cnn, string tableName, dynamic param)
        {
            SqlMapper.Execute(cnn, DynamicQuery.GetUpdateQuery(tableName, param), param);
        }
    }
}
