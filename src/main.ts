import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { AnyExceptionFilter } from './common/filters/exception.filter';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('v1/api');

  app.use(helmet());

  const options = new DocumentBuilder()
    .setTitle('Nest API')
    .setDescription('Nest API made with NestJS')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  app.useGlobalFilters(new AnyExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, '..', 'tmp', 'uploads'));
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  const document = SwaggerModule.createDocument(app, options);
  fs.writeFileSync('./client/swagger-spec.json', JSON.stringify(document));
  SwaggerModule.setup('v1/api/docs', app, document);

  await app.listen(process.env.PORT);
  new Logger().log(`Listen on http://localhost:${process.env.PORT}/v1/api`);
  new Logger().log(
    `Swagger on http://localhost:${process.env.PORT}/v1/api/docs`,
  );
}

bootstrap();
