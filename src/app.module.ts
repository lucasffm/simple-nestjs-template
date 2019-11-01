import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: ['dist/**/*.entity{.ts,.js}'],
    }),
    UsersModule,
  ],
})
export class AppModule {}
