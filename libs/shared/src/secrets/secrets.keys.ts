import { getEnvVariable, loadEnvironment } from '@shared/utils';

loadEnvironment();

export const configVariables = {
  port: Number(getEnvVariable('PORT')),
  database: {
    name: getEnvVariable('DB_NAME'),
    type: getEnvVariable('DB_TYPE') as 'postgres',
    host: getEnvVariable('DB_HOST'),
    port: Number(getEnvVariable('DB_PORT')),
    username: getEnvVariable('DB_USERNAME'),
    password: getEnvVariable('DB_PASSWORD'),
  },
  swagger: {
    url: getEnvVariable('SWAGGER_URL'),
    title: getEnvVariable('SWAGGER_TITLE'),
    description: getEnvVariable('SWAGGER_DESCRIPTION'),
    version: getEnvVariable('SWAGGER_VERSION'),
  },
  jwt: {
    secret: getEnvVariable('JWT_SECRET'),
  },
  session: {
    secret: getEnvVariable('SESSION_SECRET'),
  },
  api: {
    version: getEnvVariable('API_VERSION'),
  },
  nodeEnv: getEnvVariable('NODE_ENV'),
  publicKey: getEnvVariable('PUBLIC_KEY'),
  sentry: {
    dsn: getEnvVariable('SENTRY_DSN', false),
  },
  logger: {
    level: getEnvVariable('LOG_LEVEL'),
  },
};
