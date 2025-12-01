import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config';
import { configVariables, GlobalExceptionsFilter } from '@shared';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const logger = app.get<Logger>(Logger);
  app.useLogger(logger);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  app.enableCors({
    origin: '*',
  });

  app.setGlobalPrefix(`api/v${configVariables.api.version}`);

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`/${configVariables.swagger.url}`, app, document);

  app.useGlobalFilters(new GlobalExceptionsFilter());

  app.enableShutdownHooks();

  await app.listen(configVariables.port);

  const host = `http://localhost:${configVariables.port}`;
  logger.log(
    `Application running at: ${host}/api/v${configVariables.api.version}`,
  );
  logger.log(
    `Swagger docs available at: ${host}/${configVariables.swagger.url}`,
  );
}

bootstrap().catch((error) => {
  console.error('❌ Error starting application:', error);
  process.exit(1);
});
