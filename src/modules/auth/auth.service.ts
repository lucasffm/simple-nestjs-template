import { Injectable, HttpException } from '@nestjs/common';
import { compare, compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
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
      return { status: 404 };
    }
    const passHash = compareSync(userInfo.password, user.password);
    if (!passHash) {
      return { status: 401 };
    }
    let payload = `${user.name}${user.id}`;
    const accessToken = this.jwtService.sign(payload);

    return {
      expires_in: 6000,
      access_token: accessToken,
      user_id: user.id,
      status: 200,
    };
  }
}
