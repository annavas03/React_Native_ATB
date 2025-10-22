using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.Identity
{
    public class RoleEntity : IdentityRole<long>
    {
        public virtual ICollection<UserRoleEntity>? UserRoles { get; set; } = null;
        public RoleEntity() : base() { }
        public RoleEntity(string roleName) : base(roleName) { }
    }
}
