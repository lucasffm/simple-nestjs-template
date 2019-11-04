import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Crud } from '@nestjsx/crud';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Crud({
  model: { type: User },
  routes: {
    replaceOneBase: {
      decorators: [UseGuards(AuthGuard('jwt'))],
    },
  },
})
@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}
}
