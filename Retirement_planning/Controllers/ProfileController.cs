using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Retirement_planning.Models;
using Retirement_planning.Services;
using Microsoft.Extensions.Logging;

namespace Retirement_planning
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly ILogger<ProfileController> _logger;
        private readonly IProfileService _userDAL;

        public ProfileController(ILogger<ProfileController> logger, IProfileService userDAL)
        {
            _userDAL = userDAL ?? throw new ArgumentNullException(nameof(userDAL));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginModel user)
        {
            if (user == null || string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Password))
            {
                _logger.LogWarning("Login: Invalid login request");
                return BadRequest(new { Message = "email and password are required" });
            }

            _logger.LogInformation("Login attempt for email: {Email}", user.Email);

            try
            {
                var result = await _userDAL.ProfileLoginUserAsync(user);
                if (result == null)
                {
                    _logger.LogWarning("Login failed for email: {Email}", user.Email);
                    return Unauthorized(new { Message = "Invalid email or password" });
                }

                _logger.LogInformation("Login successful for email: {Email}", user.Email);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during login for email: {Email}", user.Email);
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Internal Server Error", Error = ex.Message });
            }
        }
    }
}
