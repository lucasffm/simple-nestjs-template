import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from '../../entity/user.entity';
import { MailerService } from '@nest-modules/mailer';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {
    super(userRepository);
  }

  async sendSampleMail(request): Promise<object> {
    return this.mailerService.sendMail({
      to: 'test@nestjs.com',
      from: 'noreply@nestjs.com',
      subject: 'Testing Nest Mailermodule with template ✔',
      template: 'sample',
      context: {
        code: 'cf1a3f828287',
        username: 'john doe',
      },
    });
  }
}
