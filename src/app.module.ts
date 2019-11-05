import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EasyconfigModule } from 'nestjs-easyconfig';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoleModule } from './modules/role/role.module';
import config from '../ormconfig';

@Module({
  imports: [
    EasyconfigModule.register({ path: './.env' }),
    TypeOrmModule.forRoot(config),
    UsersModule,
    AuthModule,
    RoleModule,
  ],
})
export class AppModule {}
