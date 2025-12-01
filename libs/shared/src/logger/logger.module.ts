import { Global, Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { configVariables } from '@shared';
import type { IncomingMessage, ServerResponse } from 'http';

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      useFactory: () => ({
        pinoHttp: {
          level: configVariables.logger.level,

          transport:
            configVariables.nodeEnv !== 'production'
              ? {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    translateTime: 'yyyy-mm-dd HH:MM:ss.l o',
                    ignore: 'pid,hostname',
                  },
                }
              : undefined,

          genReqId: (req: IncomingMessage & { id?: string }) =>
            (req.headers['x-request-id'] as string) ?? Date.now().toString(),

          serializers: {
            req(req: IncomingMessage & { id?: string }) {
              return {
                method: req.method,
                url: req.url,
                id: req.id,
              };
            },
            res(res: ServerResponse) {
              return {
                statusCode: res.statusCode,
              };
            },
            err(err: Error) {
              return {
                type: err.name,
                message: err.message,
                stack: err.stack,
              };
            },
          },

          redact: {
            paths: [
              'req.headers.authorization',
              'req.body.password',
              'req.body.token',
              '*.password',
              '*.token',
            ],
            censor: '**REDACTED**',
          },

          autoLogging:
            configVariables.nodeEnv === 'development'
              ? {
                  ignore: (req: IncomingMessage) => req.url === '/health',
                }
              : false,
        },

        forRoutes: [],
      }),
    }),
  ],
  exports: [PinoLoggerModule],
})
export class LoggerModule {}
