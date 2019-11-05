import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';
import { ApiUseTags } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiUseTags('auth')
  @Post('login')
  async login(@Body() user: LoginDto): Promise<any> {
    return this.authService.login(user);
  }
}
