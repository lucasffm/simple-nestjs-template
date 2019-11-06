import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import 'reflect-metadata';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.setGlobalPrefix('v1/api');

  app.use(helmet());

  const options = new DocumentBuilder()
    .setTitle('Sample API')
    .setDescription('Sample API with NestJS')
    .setVersion('0.1')
    .setBasePath('v1/api')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('v1/api/docs', app, document);

  await app.listen(process.env.PORT);
  console.log(`Listen on http://localhost:${process.env.PORT}/v1/api`);
  console.log(`Swagger on http://localhost:${process.env.PORT}/v1/api/docs`);
}
bootstrap();
