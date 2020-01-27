import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async login(userInfo: LoginDto): Promise<any | { status: number }> {
    const user = await this.userService.findOne({
      where: { email: userInfo.email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const passHash = compareSync(userInfo.password, user.password);
    if (!passHash) {
      throw new UnauthorizedException("password don't match with email");
    }
    let payload = { user };
    const accessToken = this.jwtService.sign(payload);

    return {
      expires_in: 6000,
      access_token: accessToken,
      user_id: user.id,
    };
  }
}
