using PMESP.TechTest.Dal.interfaces;
using PMESP.TechTest.Dal.repositorios.common;
using PMESP.TechTest.Entities;

namespace PMESP.TechTest.Dal.repositorios
{
    public class ExcelRepository : Repositorio<tbExcel>, IExcel
    {
        public ExcelRepository() : base("tbExcel") { }
    }
}