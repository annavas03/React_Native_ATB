using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.Identity
{
    public class UserRoleEntity : IdentityUserRole<long>
    {
        public virtual UserEntity User { get; set; }// = new();
        public virtual RoleEntity Role { get; set; }// = new();
    }
}
