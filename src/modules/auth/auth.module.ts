import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EasyconfigModule } from 'nestjs-easyconfig';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    EasyconfigModule.register({ path: './.env' }),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secretOrPrivateKey: 'secret12356789',
    }),
  ],
  providers: [UsersService, AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
