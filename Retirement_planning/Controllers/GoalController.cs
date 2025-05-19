using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Retirement_planning.Models;
using Retirement_planning.Services;
using Microsoft.Extensions.Logging;

namespace Retirement_planning
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoalController : ControllerBase
    {
        private readonly ILogger<GoalController> _logger;
        private readonly IGoalService _goalDAL;

        public GoalController(ILogger<GoalController> logger, IGoalService goalDAL)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _goalDAL = goalDAL ?? throw new ArgumentNullException(nameof(goalDAL));
        }

        [HttpPost("SetGoal")]
        public async Task<IActionResult> SetGoalAsync([FromBody] GoalModel goal)
        {
            _logger.LogInformation("SetGoal method called in GoalController.");

            if (goal == null)
            {
                _logger.LogError("GoalController.SetGoalAsync: Goal object is null.");
                return StatusCode(StatusCodes.Status400BadRequest, new { Message = "Invalid input! Goal object cannot be null." });
            }

            if (goal.ProfileId == null || goal.ProfileId <= 0)
            {
                _logger.LogError("GoalController.SetGoalAsync: ProfileId is invalid.");
                return StatusCode(StatusCodes.Status400BadRequest, new { Message = "Invalid input! ProfileId must be a positive value." });
            }

            if ((goal.CurrentSavings == null || goal.CurrentSavings < 0) || (goal.TargetSavings == null || goal.TargetSavings <= 0))
            {
                _logger.LogError("GoalController.SetGoalAsync: Savings values are invalid.");
                return StatusCode(StatusCodes.Status400BadRequest, new { Message = "Invalid input! Current Savings cannot be negative, and Target Savings must be greater than zero." });
            }

            if ((goal.CurrentAge == null || goal.CurrentAge < 18) || (goal.CurrentAge > 100))
            {
                _logger.LogError("GoalController.SetGoalAsync: CurrentAge is invalid.");
                return StatusCode(StatusCodes.Status400BadRequest, new { Message = "Invalid input! Age must be between 18 and 100." });
            }

            if (goal.RetirementAge < goal.CurrentAge || (goal.RetirementAge == null || goal.RetirementAge > 100))
            {
                _logger.LogError("GoalController.SetGoalAsync: RetirementAge is invalid.");
                return StatusCode(StatusCodes.Status400BadRequest, new { Message = "Invalid input! Retirement Age must be greater than Current Age and within reasonable limits (up to 100)." });
            }

            try
            {
                var result = await _goalDAL.SetGoal(goal); // `_goalDAL.SetGoal(goal)` now returns `GoalModel?`

                if (result != null) // Corrected: Check if result is not null
                {
                    _logger.LogInformation("Goal set successfully.");
                    return StatusCode(StatusCodes.Status201Created, new { Message = "Goal set successfully!", GoalDetails = result });
                }
                else
                {
                    _logger.LogWarning("Failed to set goal. Profile already has an existing goal.");
                    return StatusCode(StatusCodes.Status400BadRequest, new { Message = "Goal already exists for this profile!" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while setting goal in GoalController.");
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "An unexpected error occurred." });
            }
        }


        [HttpGet("getgoal/{profileId}")]
        public async Task<IActionResult> GetGoalByProfileId(int profileId)
        {
            _logger.LogInformation("GetGoalByProfileId method called in GoalController for ProfileId: {ProfileId}", profileId);

            if (profileId <= 0)
            {
                _logger.LogWarning("Invalid ProfileId received: {ProfileId}", profileId);
                return BadRequest(new { Message = "Invalid ProfileId" });
            }
            try
            {
                var result = await _goalDAL.GetGoalByProfileId(profileId);
                if (result == null)
                {
                    _logger.LogWarning("No goal found for ProfileId: {ProfileId}", profileId);
                    return NotFound(new { Message = "Goal not found" });
                }
                _logger.LogInformation("Goal retrieved successfully for ProfileId: {ProfileId}", profileId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching goal in GoalController for ProfileId: {ProfileId}", profileId);
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Internal Server Error" });
            }
        }
    }
}
