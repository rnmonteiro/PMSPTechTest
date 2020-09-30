using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace PMESP.TechTest.Entities
{
    public class tbImportacao
    {
        public int? Id { get; set; }

        public DateTime DtImportacao { get; set; }

        public int TotalItens { get; set; }

        public DateTime DtMenorEntrega { get; set; }

        public decimal VlTotal { get; set; }

    }
}
