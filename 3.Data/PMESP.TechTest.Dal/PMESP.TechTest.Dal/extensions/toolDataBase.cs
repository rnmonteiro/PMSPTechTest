using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace PMESP.TechTest.Dal.extensions
{
    public class ToolDataBase
    {
        public static string Where<T>(T para) where T : class
        {
            var where = string.Empty;
            if (para == null)
                return where;

            foreach (var it in para.GetType().GetProperties())
            {
                var value = it.GetValue(para, null);
                if (Equals(value, null) || Equals(value, 0) || Equals(value, (long)0) || Equals(value, string.Empty))
                    continue;

                where += string.Format("\nAND {0} = @{0}", it.Name);
            }

            if (!string.IsNullOrEmpty(where))
                where = string.Format("\nWHERE {0}", where.Substring(4, where.Length - 4));

            return where;
        }

        public static string FieldFirst<T>(T table) where T : class
        {
            var field = table.GetType().GetProperties().Select(a => a.Name).First();

            return string.Format("{0} = @{0}", field);
        }

        public static string FieldUpdate<T>(T table, bool firstIdentity = false) where T : class
        {
            var field = string.Empty;

            foreach (var it in table.GetType().GetProperties().Select(a => a.Name))
            {
                if (firstIdentity && string.IsNullOrEmpty(field))
                {
                    firstIdentity = false;
                    continue;
                }
                field += string.Format("\n{0} = @{0}, ", it);
            }

            field = field.Substring(0, field.Length - 2);

            return field;
        }

        public static string FieldUpdate(List<dynamic> lstDynamic)
        {
            var field = string.Empty;

            foreach (var it in lstDynamic)
            {                
                field += string.Format("\n{0} = @{0}, ", it);
            }

            field = field.Substring(0, field.Length - 2);
            return field;
        }

        public static string FieldMax<T>(T table) where T : class
        {
            return "IsNull(Max( " + table.GetType().GetProperties().Select(a => a.Name).FirstOrDefault() + "),0) + 1";
        }

        public static string Field<T>(T table, bool firstIdentity = false) where T : class
        {
            return FieldAll(table, false, firstIdentity);
        }
        public static string FieldVariable<T>(T table, bool firstIdentity = false) where T : class
        {
            return FieldAll(table, true, firstIdentity);
        }
        private static string FieldAll<T>(T table, bool fieldVariable = false, bool firstIdentity = false) where T : class
        {
            var field = string.Empty;

            foreach (var it in table.GetType().GetProperties().Select(a => a.Name))
            {
                if (firstIdentity && string.IsNullOrEmpty(field))
                {
                    firstIdentity = false;
                    continue;
                }

                if (fieldVariable)
                    field += "@";

                field += it + ", ";
            }

            field = field.Substring(0, field.Length - 2);

            return field;
        }

        public static string Values<T>(T para, bool firstIdentity = false)
            where T : class
        {
            var field = string.Empty;

            foreach (var it in para.GetType().GetProperties())
            {
                if (firstIdentity)
                {
                    firstIdentity = false;
                    continue;
                }

                //var value = it.GetValue(para, null) ?? DBNull.Value;
                field += $"@{it.Name}, ";
            }

            field = field.Substring(0, field.Length - 2);

            return field;
        }

        public static string Table<T>(T table) where T : class
        {
            var str = table.ToString().ToLower().Split('.').LastOrDefault();

            if (str == null)
                return string.Empty;

            if (str.EndsWith("dto"))
                str = str.Substring(0, str.Length - 3);

            return "TBPB4_Cognizant_Robos_" + str;
        }

        public static IDbCommand GetCommand(string query, IDbConnection connection, IEnumerable<IDbDataParameter> lsParameters = null, IDbTransaction transaction = null)
        {
            Console.WriteLine(query);

            var cmd = connection.CreateCommand();
            cmd.CommandText = query;
            cmd.CommandType = CommandType.Text;
            if (transaction != null)
                cmd.Transaction = transaction;

            if (lsParameters == null)
                return cmd;

            foreach (var it in lsParameters)
                cmd.Parameters.Add(it);

            return cmd;
        }

        //public static List<IDbDataParameter> ParametersFirstField<T>(TypeDataBase tp, IDbConnection connection, T para)
        //   where T : class
        //{
        //    var lsReturn = new List<IDbDataParameter>();

        //    if (para == null)
        //        return lsReturn;

        //    foreach (var it in para.GetType().GetProperties())
        //    {
        //        var value = it.GetValue(para, null) ?? DBNull.Value;

        //        switch (tp)
        //        {
        //            case TypeDataBase.Sql:
        //                lsReturn.Add(new SqlParameter { ParameterName = "@" + it.Name, Value = value });
        //                break;
        //        }
        //        break;
        //    }
        //    return lsReturn;
        //}

        //public static List<IDbDataParameter> ParametersValues<T>(TypeDataBase tp, IDbConnection connection, T para, bool firstIdentity = false)
        //    where T : class
        //{
        //    var lsReturn = new List<IDbDataParameter>();

        //    if (para == null)
        //        return lsReturn;

        //    foreach (var it in para.GetType().GetProperties())
        //    {
        //        if (firstIdentity && !lsReturn.Any())
        //        {
        //            firstIdentity = false;
        //            continue;
        //        }
        //        var value = it.GetValue(para, null) ?? DBNull.Value;
        //        switch (tp)
        //        {
        //            case TypeDataBase.Sql:
        //                lsReturn.Add(new SqlParameter { ParameterName = "@" + it.Name, Value = value });
        //                break;
        //        }
        //    }
        //    return lsReturn;
        //}

        //public static List<IDbDataParameter> ParametersValuesWhere<T>(TypeDataBase tp, IDbConnection connection, T para)
        //    where T : class
        //{
        //    var lsReturn = new List<IDbDataParameter>();

        //    if (para == null)
        //        return lsReturn;

        //    foreach (var it in para.GetType().GetProperties())
        //    {
        //        var value = it.GetValue(para, null);
        //        if (Equals(value, null) || Equals(value, 0) || Equals(value, (long)0) || Equals(value, string.Empty))
        //            continue;

        //        value = it.GetValue(para, null) ?? DBNull.Value;

        //        switch (tp)
        //        {
        //            case TypeDataBase.Sql:
        //                lsReturn.Add(new SqlParameter { ParameterName = "@" + it.Name, Value = value });
        //                break;
        //        }
        //    }
        //    return lsReturn;
        //}
    }
}
