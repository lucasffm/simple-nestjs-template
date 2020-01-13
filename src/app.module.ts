import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'path';
import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';
import { EasyconfigModule } from 'nestjs-easyconfig';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoleModule } from './modules/role/role.module';
import config from '../ormconfig';

@Module({
  imports: [
    EasyconfigModule.register({ path: './.env' }),
    TypeOrmModule.forRoot(config),
    MailerModule.forRoot({
      transport: `smtp://${process.env.MAIL_USER}:${process.env.MAIL_PASS}@${process.env.MAIL_HOST}`,
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
      template: {
        dir: resolve(__dirname, 'common', 'templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter()
        options: {
          strict: true,
        },
      },
    }),
    UsersModule,
    AuthModule,
    RoleModule,
  ],
})
export class AppModule {}
