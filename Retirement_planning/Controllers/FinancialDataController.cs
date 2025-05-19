using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Retirement_planning.Models;
using Retirement_planning.Services;
using Microsoft.Extensions.Logging;

namespace Retirement_planning
{
    [Route("api/[controller]")]
    [ApiController]
    public class FinancialDataController : ControllerBase
    {
        private readonly ILogger<FinancialDataController> _logger;
        private readonly IFinancialYearService _financialYearService;

        public FinancialDataController(ILogger<FinancialDataController> logger, IFinancialYearService financialYearService)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _financialYearService = financialYearService ?? throw new ArgumentNullException(nameof(financialYearService));
        }

        [HttpPost("setfinancialyear")]
        public async Task<IActionResult> SetFinancialYear([FromBody] FinancialYearModel financialYear)
        {
            _logger.LogInformation("SetFinancialYear method called in FinancialDataController.");

            if (financialYear == null)
            {
                _logger.LogWarning("Received null financial year object.");
                return BadRequest(new { Message = "Financial year object cannot be null" });
            }

            try 
            {
                var savedData = await _financialYearService.SetFinancialYear(financialYear);

                if (savedData != null)
                {
                    _logger.LogInformation("Financial year set successfully for Goal ID {GoalId}", savedData.GoalId);
                    return Ok(new { Message = "Financial year set successfully", Data = savedData });
                }
                else
                {
                    _logger.LogWarning("Failed to set financial year.");
                    return BadRequest(new { Message = "Failed to set financial year" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while setting financial year in FinancialDataController.");
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Internal Server Error" });
            }
        }

    }
}