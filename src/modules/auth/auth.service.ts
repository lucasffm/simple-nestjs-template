import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { compare, compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../../entity/user.entity';
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
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const passHash = compareSync(userInfo.password, user.password);
    if (!passHash) {
      throw new HttpException(
        "password don't match with email",
        HttpStatus.UNAUTHORIZED,
      );
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
