import { DataSource, DataSourceOptions } from 'typeorm';
import { configVariables } from '@shared';
import { join } from 'path';

const isDevelopment = configVariables.nodeEnv === 'development';
const isProduction = configVariables.nodeEnv === 'production';

const dataSourceOptions: DataSourceOptions = {
  type: configVariables.database.type as 'postgres',
  host: configVariables.database.host,
  port: configVariables.database.port,
  username: configVariables.database.username,
  password: configVariables.database.password,
  database: configVariables.database.name,
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  synchronize: false,
  logging: isDevelopment ? ['query', 'error', 'warn'] : ['error'],
  maxQueryExecutionTime: isDevelopment ? 1000 : 5000,
  extra: {
    max: isProduction ? 20 : 10,
    min: isProduction ? 5 : 2,
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 600000,
    statement_timeout: 30000,
  },
  ssl: isProduction
    ? {
        rejectUnauthorized: false,
      }
    : false,
  ...(isProduction && {
    cache: {
      type: 'database' as const,
      duration: 60000,
    },
  }),
};

export const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
