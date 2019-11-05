import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Crud } from '@nestjsx/crud';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { ApiUseTags } from '@nestjs/swagger';

@Crud({
  model: { type: User },
  routes: {
    getManyBase: {
      decorators: [UseGuards(AuthGuard('jwt'))],
    },
  },
})
@ApiUseTags('users')
@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}
}
