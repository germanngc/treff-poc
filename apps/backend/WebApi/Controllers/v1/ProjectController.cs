using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Features.CategoryFeatures.Queries;
using Application.Features.ProjectFeature.Queries;
using Application.Features.ProjectFeatures.Commands;
using Application.Features.ProjectFeatures.Queries;
using Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers.v1
{
    [ApiVersion("1.0")]
    public class ProjectController : BaseApiController
    {
        /// <summary>
        /// Creates a New Product.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> Create(CreateProjectCommand command)
        {
            return Ok(await Mediator.Send(command));
        }
        /// <summary>
        /// Gets all Products.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await Mediator.Send(new GetAllCategoriesQuery()));
        }
        /// <summary>
        /// Gets Project Entity by Id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            return Ok(await Mediator.Send(new GetProjectrByIdQuery { Id = id }));
        }

        /// <summary>
        /// Gets Project Entity by Freelancer Id.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost("freelancer")]
        public async Task<IActionResult> GetActiveProjectsByFreelancerId(GetActiveProjectByFreelancerIdQuery command)
        {
            return Ok(await Mediator.Send(command));
        }
        /// <summary>
        /// Gets Project Entity by User Id.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost("user")]
        public async Task<IActionResult> GetActiveProjectsByUserId(GetActiveProjectByUserIdQuery command)
        {
            return Ok(await Mediator.Send(command));
        }


        [HttpGet("{freelancerId}/grouped-by-user")]
        public async Task<IActionResult> GetProjectsGroupedByUserId(int freelancerId)
        {
            var query = new GetProjectsGroupedByUserIdQuery { FreelancerId = freelancerId };
            var result = await Mediator.Send(query);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }
        [HttpGet("{freelancerId}/views-by-user")]
        public async Task<IActionResult> GetProjectsAndViewsByUserId(int freelancerId)
        {
            var query = new GetProjectsAndViewsByUserIdQuery { FreelancerId = freelancerId };
            var result = await Mediator.Send(query);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }
    }
}