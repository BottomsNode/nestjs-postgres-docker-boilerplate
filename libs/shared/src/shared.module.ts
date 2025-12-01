import { DynamicModule, Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { CqrsMediator } from './cqrs/cqrs.mediator';
import { configVariables } from './secrets';
import { LoggerModule } from 'nestjs-pino';
// Import other shared services, guards, helpers, interceptors as needed

@Global()
@Module({})
export class SharedBaseModule {
  public static forRoot(): DynamicModule {
    return {
      module: SharedBaseModule,
      global: true,
      imports: [
        CqrsModule,
        JwtModule.register({
          secret: configVariables.jwt.secret,
          signOptions: { expiresIn: '1d' },
        }),
        LoggerModule,
      ],
      providers: [
        CqrsMediator,
        // add other shared providers here
      ],
      exports: [
        CqrsMediator,
        // export other shared providers for DI
        JwtModule,
      ],
    };
  }
}
