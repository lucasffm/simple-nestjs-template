import { Controller, UseGuards, Req, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Crud } from '@nestjsx/crud';
import { UsersService } from './users.service';
import { User } from '../../entity/user.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('users')
@ApiTags('users')
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
      decorators: [UseGuards(AuthGuard('jwt'), RolesGuard), Roles('Admin')],
    },
    createOneBase: {},
  },
})
export class UsersController {
  constructor(private service: UsersService) {}

  @Get('send-mail')
  sendMailSample(@Req() request) {
    return this.service.sendSampleMail(request);
  }
}
