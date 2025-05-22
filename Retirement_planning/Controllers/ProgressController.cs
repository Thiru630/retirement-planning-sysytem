using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Retirement_planning.Models;
using Retirement_planning.Services;
using Microsoft.Extensions.Logging;

namespace Retirement_planning
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProgressController : ControllerBase
    {
        private readonly ILogger<ProgressController> _logger;
        private readonly IProgressService _progressDAL;

        public ProgressController(ILogger<ProgressController> logger, IProgressService progressDAL)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _progressDAL = progressDAL ?? throw new ArgumentNullException(nameof(progressDAL));
        }

        [HttpGet("getprogress/{goalId}")]
        public async Task<IActionResult> GetProgressByGoalId(int goalId)
        {
            _logger.LogInformation("GetProgressByGoalId method called in ProgressController for GoalId: {GoalId}", goalId);

            if (goalId <= 0)
            {
                _logger.LogWarning("Invalid GoalId received: {GoalId}", goalId);
                return BadRequest(new { Message = "Invalid GoalId" });
            }

            try
            {
                var result = await _progressDAL.GetProgressByGoalId(goalId);
                
                if (result == null)
                {
                    _logger.LogWarning("No progress found for GoalId: {GoalId}", goalId);
                    return NotFound(new { Message = "Progress not found" });
                }

                _logger.LogInformation("Progress retrieved successfully for GoalId: {GoalId}", goalId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching progress in ProgressController for GoalId: {GoalId}", goalId);
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Internal Server Error" });
            }
        }

    }
}