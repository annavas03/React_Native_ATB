using AutoMapper;
using Core.Constants;
using Core.Interfaces;
using Core.Models.Account;
using Domain.Entities.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace atbApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    // Конструктор контролера, через Dependency Injection отримує сервіси
    public class AccountController(IJwtTokenService jwtTokenService,
            IMapper mapper, IImageService imageService,
            UserManager<UserEntity> userManager) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await userManager.FindByEmailAsync(model.Email);
            if (user != null && await userManager.CheckPasswordAsync(user, model.Password))
            {
                var token = await jwtTokenService.CreateTokenAsync(user);
                return Ok(new {
                    token ,
                    user = new
                    {
                        id = user.Id,
                        email = user.Email,
                        firstName = user.FirstName,
                        lastName = user.LastName,
                        image = user.Image
                    }
                });
            }
            return Unauthorized("Invalid email or password");
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromForm] RegisterModel model)
        {
            var request = Request;

            var user = mapper.Map<UserEntity>(model);

            if (model.ImageFile != null)
            {
                // Зберігає зображення і присвоює шлях користувачу
                user.Image = await imageService.SaveImageAsync(model.ImageFile);
            }

            var result = await userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                // Додає користувача в роль "User"
                await userManager.AddToRoleAsync(user, Roles.User);
                var token = await jwtTokenService.CreateTokenAsync(user);

                return Ok(new
                {
                    token,
                    user = new
                    {
                        id = user.Id,
                        email = user.Email,
                        firstName = user.FirstName,
                        lastName = user.LastName,
                        image = user.Image
                    }
                });
            }
            else
            {
                return BadRequest(new
                {
                    status = 400,
                    isValid = false,
                    errors = result.Errors.ToList()
                });
            }
        }

        [Authorize]
        [HttpGet("current")]
        public async Task<IActionResult> GetCurrentUser()
        {

            var email = User.FindFirstValue(ClaimTypes.Email);

            if (email == null)
                return Unauthorized("Invalid token or missing email claim.");

            var user = await userManager.FindByEmailAsync(email);
            if (user == null)
                return NotFound("User not found.");

            return Ok(new
            {
                id = user.Id,
                email = user.Email,
                firstName = user.FirstName,
                lastName = user.LastName,
                image = user.Image
            });
        }

    }
}