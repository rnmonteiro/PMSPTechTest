using System.Configuration;
using Microsoft.Data.SqlClient;

namespace PMESP.TechTest.Dal.querys
{
    public static class QueryTool
    {
        public static SqlConnection GetConnection()
        {
            return new SqlConnection("Data Source=(LocalDb)\\MSSQLLocalDB;Initial Catalog=PMSPTechTest;Integrated Security=True");
        }
    }
}
