using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using PMESP.TechTest.Dal;
using PMESP.TechTest.Entities;
using PMSP.TechTest.Bll;
using ControllerBase = Microsoft.AspNetCore.Mvc.ControllerBase;
using HttpGetAttribute = Microsoft.AspNetCore.Mvc.HttpGetAttribute;
using HttpPostAttribute = Microsoft.AspNetCore.Mvc.HttpPostAttribute;
using JsonResult = System.Web.Mvc.JsonResult;
using RouteAttribute = Microsoft.AspNetCore.Mvc.RouteAttribute;

namespace ExcelAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReceiveFileController : ControllerBase
    {
        // GET: api/GetImportacoes
        [HttpGet]
        public JsonResult GetImportacoes()
        {
            var result = new APIbll().GetImportacoes();

            return Json(new
            {
                aaData = result
            }, JsonRequestBehavior.AllowGet);
        }

        // GET: api/GetImportacao/1
        [HttpGet("{id}")]
        public ActionResult<tbImportacao> GetImportacao(int id)
        {
            return Ok(new APIbll().GetImportacao(id));
        }

        [HttpPost]
        public async Task<IActionResult> UploadFile([FromForm(Name = "body")] IFormFile formData)
        {
            if (formData == null || formData.Length == 0)
            {
                return RedirectToAction("");
            }

            var lsFiles = new List<tbExcel>();

            using (var memoryStream = new MemoryStream())
            {
                await formData.CopyToAsync(memoryStream).ConfigureAwait(false);

                using (var package = new ExcelPackage(memoryStream))
                {
                    var sheets = package.Workbook.Worksheets;

                    for (int i = 1; i <= sheets.Count; i++)
                    {
                        var totalRows = sheets[i].Dimension?.Rows;
                        var totalCollumns = sheets[i].Dimension?.Columns;
                        for (int j = 1; j <= totalRows.Value; j++)
                        {
                            //Ignora o header
                            if (j == 1)
                                continue;

                            try
                            {
                                var file = new tbExcel()
                                {
                                    DataEntrega = DateTime.Parse(sheets[i].Cells[j, 1].Value.ToString()),
                                    NomeProduto = sheets[i].Cells[j, 2].Value.ToString(),
                                    Quantidade = int.Parse(sheets[i].Cells[j, 3].Value.ToString()),
                                    ValorUnitario = decimal.Parse(sheets[i].Cells[j, 4].Value.ToString())
                                };

                                var valid = new APIbll().ValidateFile(file);

                                if (valid)
                                    lsFiles.Add(file);
                            }
                            catch (Exception)
                            {
                                return Content("Ocorreu um erro inesperado, tente mais tarde!");
                            }
                        }
                    }

                    if (lsFiles.Count > 0)
                    {
                        new APIbll().SaveFile(lsFiles);

                        new APIbll().SaveImportacao(new tbImportacao()
                        {
                            DtImportacao = DateTime.Now,
                            TotalItens = lsFiles.Count,
                            DtMenorEntrega = lsFiles.Min(x => x.DataEntrega),
                            VlTotal = lsFiles.Sum(a => a.ValorUnitario)
                        });
                    }
                    else
                        return Content("Ocorreu um erro inesperado, tente mais tarde!");

                    return Ok("Arquivo salvo com sucesso!");
                }
            }
        }


        /// <summary>  
        /// Override the JSON Result with Max integer JSON lenght  
        /// </summary>  
        /// <param name="data">Data</param>  
        /// <param name="behavior">Behavior</param>  
        /// <returns>As JsonResult</returns>  
        private new JsonResult Json(object data, JsonRequestBehavior behavior)
        {
            return new JsonResult()
            {
                Data = data,
                JsonRequestBehavior = behavior,
                MaxJsonLength = int.MaxValue,
                ContentType = null,
                ContentEncoding = null,
                RecursionLimit = null
            };
        }
    }
}
