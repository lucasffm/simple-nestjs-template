import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Crud } from '@nestjsx/crud';
import { UsersService } from './users.service';
import { User } from '../../entity/user.entity';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiUseTags('users')
@ApiBearerAuth()
@Crud({
  model: { type: User },
  query: {
    join: {
      roles: {
        allow: [],
      },
    },
  },
  routes: {
    getManyBase: {
      decorators: [UseGuards(AuthGuard('jwt'))],
    },
  },
})
@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}
}
