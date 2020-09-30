using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace PMESP.TechTest.Entities
{
    public class tbExcel
    {
        public int? Id { get; set; }

        public DateTime DataEntrega { get; set; }

        public string NomeProduto { get; set; }

        public int Quantidade { get; set; }

        public decimal ValorUnitario { get; set; }
    }
}
