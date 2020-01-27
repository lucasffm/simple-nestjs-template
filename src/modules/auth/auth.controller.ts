import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiTags('auth')
  @Post('login')
  async login(@Body() user: LoginDto): Promise<any> {
    console.log('AQUIII');
    return this.authService.login(user);
  }
}
