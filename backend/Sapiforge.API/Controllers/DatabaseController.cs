using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sapiforge.Data;
using System.Data;

namespace Sapiforge.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DatabaseController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DatabaseController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("tables")]
        public IActionResult GetTables()
        {
            var tables = _context.Model.GetEntityTypes()
                .Select(t => t.GetTableName())
                .Distinct()
                .ToList();
            
            return Ok(tables);
        }

        [HttpPost("query")]
        public async Task<IActionResult> ExecuteQuery([FromBody] QueryRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Sql))
                return BadRequest("Query cannot be empty.");

            var sql = request.Sql.Trim();
            if (!sql.StartsWith("SELECT", StringComparison.OrdinalIgnoreCase))
                return BadRequest("Only SELECT queries are allowed for security reasons.");

            try
            {
                using var command = _context.Database.GetDbConnection().CreateCommand();
                command.CommandText = sql;
                _context.Database.OpenConnection();

                using var reader = await command.ExecuteReaderAsync();
                var dt = new DataTable();
                dt.Load(reader);

                var result = new List<Dictionary<string, object>>();
                foreach (DataRow row in dt.Rows)
                {
                    var dict = new Dictionary<string, object>();
                    foreach (DataColumn col in dt.Columns)
                    {
                        dict[col.ColumnName] = row[col];
                    }
                    result.Add(dict);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            finally
            {
                _context.Database.CloseConnection();
            }
        }

        public class QueryRequest
        {
            public string Sql { get; set; } = string.Empty;
        }
    }
}
