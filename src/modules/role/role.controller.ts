import { Controller, UseGuards } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { AuthGuard } from '@nestjs/passport';
import { ApiUseTags } from '@nestjs/swagger';
import { Role } from './role.entity';
import { RoleService } from './role.service';

@Crud({
  model: { type: Role },
  routes: {
    getManyBase: {
      decorators: [UseGuards(AuthGuard('jwt'))],
    },
  },
})
@ApiUseTags('roles')
@Controller('role')
export class RoleController {
  constructor(private service: RoleService) {}
}
