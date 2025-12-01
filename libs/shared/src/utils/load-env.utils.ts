import * as dotenv from 'dotenv';
import { join } from 'path';

export function loadEnvironment() {
  const basePath = join(process.cwd(), 'src/environment/.env');

  dotenv.config({ path: basePath });

  const envFileMap: Record<string, string> = {
    production: '.env.prod',
    development: '.env',
    test: '.env.test',
    docker: '.env.docker',
  };

  const nodeEnv = process.env.NODE_ENV || 'development';
  const envFile = envFileMap[nodeEnv];

  if (envFile && envFile !== '.env') {
    dotenv.config({
      path: join(process.cwd(), `src/environment/${envFile}`),
      override: true,
    });
  }
}
