using AutoMapper;
using Core.Models;
using Domain.Entities.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Mapper
{
    public class UserMapper : Profile
    {
        public UserMapper()
        {
            CreateMap<SeederUserModel, UserEntity>()
                .ForMember(opt => opt.UserName, opt => opt.MapFrom(x => x.Email));
        }
    }
}
