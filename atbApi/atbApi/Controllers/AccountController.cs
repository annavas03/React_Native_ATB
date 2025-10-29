using AutoMapper;
using Core.Constants;
using Core.Interfaces;
using Core.Models.Account;
using Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

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
                return Ok(new { Token = token });
            }
            return Unauthorized("Invalid email or password");
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromForm] RegisterModel model)
        {
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
    }
}