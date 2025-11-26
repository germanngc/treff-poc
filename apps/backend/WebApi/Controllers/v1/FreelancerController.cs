using System.Threading.Tasks;
using Application.Features.FreelancerFeatures.Commands;
using Application.Features.FreelancerFeatures.Queries;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers.v1
{
    [ApiVersion("1.0")]
    public class FreelancerController : BaseApiController
    {
        /// <summary>
        /// Gets Freelancer Entity by Id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            return Ok(await Mediator.Send(new GetFreelancerByIdQuery { Id = id }));
        }
        /// <summary>
        /// Gets Services Entity by Freelancer Id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("services/{id}")]
        public async Task<IActionResult> GetByCategoryId(int id)
        {
            return Ok(await Mediator.Send(new GetAllServicesByFreelancerIdQuery { FreelancerId = id }));
        }
        /// <summary>
        /// Gets All Admins.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("admin")]
        public async Task<IActionResult> GetAllAdmins()
        {
            return Ok(await Mediator.Send(new GetAllAdminsQuery()));
        }
        /// <summary>
        /// Creates a New Freelancer.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> Create(CreateFreelancerCommand command)
        {
            return Ok(await Mediator.Send(command));
        }
        /// <summary>
        /// Logins Freelancer.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login(LoginFreelancerCommand command)
        {
            return Ok(await Mediator.Send(command));
        }
        /// <summary>
        /// Logins Freelancer by Principal.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("loginByPrincipal")]
        public async Task<IActionResult> LoginByPrincipal(LoginFreelancerByPrincipalCommand command)
        {
            return Ok(await Mediator.Send(command));
        }
        /// <summary>
        /// Updates Freelancer Education.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("educations")]
        public async Task<IActionResult> UpdateEducations(UpdateFreelancerEducationCommand command)
        {
            return Ok(await Mediator.Send(command));
        }
        /// <summary>
        /// Updates Freelancer Certification.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("certifications")]
        public async Task<IActionResult> UpdateCertifications(UpdateFreelancerCertificationCommand command)
        {
            return Ok(await Mediator.Send(command));
        }
        /// <summary>
        /// Updates Freelancer Language.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("languages")]
        public async Task<IActionResult> UpdateLanguages(UpdateFreelancerLanguageCommand command)
        {
            return Ok(await Mediator.Send(command));
        }
        /// <summary>
        /// Updates the Freelancer Entity based on Id.   
        /// </summary>
        /// <param name="id"></param>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPut("[action]")]
        public async Task<IActionResult> Update(int id, UpdateFreelancerCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest();
            }
            return Ok(await Mediator.Send(command));
        }

        /// <summary>
        /// Updates Freelancer Language.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("updatePhoto")]
        public async Task<IActionResult> UpdatePhoto(UpdateFreelancerPhotoCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        /// <summary>
        /// Updates Freelancer Password.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("updatePassword")]
        public async Task<IActionResult> UpdatePassword(UpdateFreelancerPasswordCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        /// <summary>
        /// Updates Freelancer NotificationId.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("updateNotificationId")]
        public async Task<IActionResult> UpdateNotificationId(UpdateFreelancerNotificationIdCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        /// <summary>
        /// Updates Freelancer ChatId.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("updateChatId")]
        public async Task<IActionResult> UpdateChatId(UpdateFreelancerChatIdCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        /// <summary>
        /// Sens SMS validation.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("validateSms")]
        public async Task<IActionResult> ValidateSms(ValidateSmsFreelancerCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        /// <summary>
        /// Sends email validation.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("validateEmail")]
        public async Task<IActionResult> ValidateEmail(ValidateEmailFreelancerCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        /// <summary>
        /// Updates Freelancer Language.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("validateCode")]
        public async Task<IActionResult> ValidateCode(ValidateCodeFreelancerCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        /// <summary>
        /// Login Freelancer third party.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("loginThirdParty")]
        public async Task<IActionResult> LoginThirdParty(CreateFreelancerThirdPartyCommand command)
        {
            return Ok(await Mediator.Send(command));
        }
    }
}