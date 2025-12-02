import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // CORS configuration from environment
  app.enableCors({
    origin: configService.get('app.corsOrigin'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // API prefix (e.g., /api/*)
  const apiPrefix = configService.get('app.apiPrefix');
  if (apiPrefix) {
    app.setGlobalPrefix(apiPrefix);
  }

  // Port from environment
  const port = configService.get('app.port');
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}/${apiPrefix || ''}`);
}
bootstrap();


