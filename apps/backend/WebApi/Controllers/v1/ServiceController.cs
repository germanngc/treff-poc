using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Application.Features.CategoryFeatures.Queries;
using Application.Features.ServiceFeatures.Commands;
using Application.Features.ServiceFeatures.Queries;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers.v1
{
    [ApiVersion("1.0")]
    public class ServiceController : BaseApiController
    {
        /// <summary>
        /// Gets all Categories.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("test")]
        public async Task<IActionResult> Test()
        {
            return Ok("hola mundo Devops! ");
        }
        /// <summary>
        /// Gets all Categories.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await Mediator.Send(new GetAllCategoriesQuery()));
        }
        /// <summary>
        /// Gets Service Entity by Id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            return Ok(await Mediator.Send(new GetServiceByIdQuery { Id = id }));
        }
        /// <summary>
        /// Gets Service Entity by Category Id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("category")]
        public async Task<IActionResult> GetByCategoryId(GetAllServicesByCategoryIdQuery command)
        {
            return Ok(await Mediator.Send(command));
        }
        /// <summary>
        /// Gets Service Entity by Category Id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("categoryPremium")]
        public async Task<IActionResult> GetPremiumByCategoryId(GetAllServicesPremiumByCategoryIdQuery command)
        {
            return Ok(await Mediator.Send(command));
        }

        /// <summary>
        /// Gets Service Entity by limit.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("highlightLimit")]
        public async Task<IActionResult> GetPremiumLimitId(GetAllServicesPremiumLimitQuery command)
        {
            return Ok(await Mediator.Send(command));
        }

        /// <summary>
        /// Gets Service Entity by limit.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("limit")]
        public async Task<IActionResult> GetLimitId(GetAllServicesLimitQuery command)
        {
            return Ok(await Mediator.Send(command));
        }
        [HttpPost]
        [Route("file")]
        public async Task<IActionResult> OnPostUploadAsync(IFormFile FormFiles)
        {
            //long size = files.FormFiles.Sum(f => f.Length);

            //foreach (var formFile in FormFiles)
            //{
            //    if (formFile.Length > 0)
            //    {
            //        var filePath = Path.GetTempFileName();

            //        using (var stream = System.IO.File.Create(filePath))
            //        {
            //            await formFile.CopyToAsync(stream);
            //        }
            //    }
            //}
            var path = AppDomain.CurrentDomain.BaseDirectory + @"Images\";
            var filePath = Path.GetTempFileName();

            using (var stream = System.IO.File.Create(path + FormFiles.FileName))
            {
                await FormFiles.CopyToAsync(stream);
            }

            // Process uploaded files
            // Don't rely on or trust the FileName property without validation.

            return Ok(new { count = 1 });
        }
        /// <summary>
        /// Creates new service
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> OnPostUploadAsync(CreateServiceCommand command)
        {
            return Ok(await Mediator.Send(command));
        }
        /// <summary>
        /// Edits service
        /// </summary>
        /// <param name="id"></param>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPut]
        public async Task<IActionResult> OnPutUploadAsync(int id, EditServiceCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest();
            }
            return Ok(await Mediator.Send(command));
        }
        /// <summary>
        /// Creates new service view
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost("views")]
        public async Task<IActionResult> SetViewService(SetViewServiceCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        /// <summary>
        /// Filer services
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost("filter")]
        public async Task<IActionResult> FilterServices(FilterServicesCommand command)
        {
            return Ok(await Mediator.Send(command));
        }
    }
}