import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';

const port = process.env.PORT || 3000;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Documentation')
    .setVersion('1.0')
    .build();

  const options: SwaggerDocumentOptions = {
    deepScanRoutes: false,
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
    },
  });
  await app.listen(port);
}

bootstrap();

