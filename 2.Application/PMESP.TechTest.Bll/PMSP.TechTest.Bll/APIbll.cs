using PMESP.TechTest.Dal;
using PMESP.TechTest.Dal.interfaces;
using PMESP.TechTest.Dal.repositorios;
using PMESP.TechTest.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.XPath;

namespace PMSP.TechTest.Bll
{
    public class APIbll
    {
        IExcel _excel;
        IImportacao _importacao;
        public APIbll()
        {
            _excel = new ExcelRepository();
            _importacao = new ImportacaoRepository();
        }

        public List<tbImportacao> GetImportacoes()
        {
            return _importacao.GetAll().ToList();
        }

        public async Task<tbImportacao> GetImportacao(int id)
        {
            var myTask = Task.Run(() => _importacao.GetById(id));

            return await myTask;
        }

        public bool ValidateFile(tbExcel file)
        {
            if (String.IsNullOrWhiteSpace(file.NomeProduto) && file.NomeProduto.Length > 50)
                return false;

            if (file.Quantidade <= 0)
                return false;

            if (file.ValorUnitario <= 0)
                return false;

            if (file.DataEntrega <= DateTime.Now)
                return false;

            return true;
        }

        public void SaveFile(List<tbExcel> lsFiles)
        {
            try
            {
                lsFiles.ForEach(file => {
                    _excel.Insert(file);
                });
            }
            catch (Exception)
            {
                throw;
            }
        }

        public void SaveImportacao(tbImportacao importacao)
        {
            try
            {
                _importacao.Insert(importacao);
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
