import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';
import { ExpressAdapter } from '@nestjs/platform-express';
import 'reflect-metadata';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());
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
  fs.writeFileSync('./client/swagger-spec.json', JSON.stringify(document));
  SwaggerModule.setup('v1/api/docs', app, document);

  await app.listen(process.env.PORT);
  console.log(`Listen on http://localhost:${process.env.PORT}/v1/api`);
  console.log(`Swagger on http://localhost:${process.env.PORT}/v1/api/docs`);
}
bootstrap();
