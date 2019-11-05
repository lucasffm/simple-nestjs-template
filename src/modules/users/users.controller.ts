import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Crud } from '@nestjsx/crud';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';

@Crud({
  model: { type: User },
  routes: {
    getManyBase: {
      decorators: [UseGuards(AuthGuard('jwt'))],
    },
  },
})
@ApiUseTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}
}
