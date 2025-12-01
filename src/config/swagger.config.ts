import { DocumentBuilder } from '@nestjs/swagger';
import { configVariables } from '@shared';
import { host } from './constant';

export const swaggerConfig = new DocumentBuilder()
  .setTitle(configVariables.swagger.title)
  .setDescription(`${configVariables.swagger.description} API Documentation`)
  .setVersion(`V${configVariables.swagger.version}`)
  .addServer(host, `${configVariables.nodeEnv} environment`)
  .addTag(configVariables.swagger.title)
  .addBearerAuth()
  .build();
