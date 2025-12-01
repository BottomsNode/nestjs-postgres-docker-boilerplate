import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from '@config/database-connect.msg';
import { AppDataSource } from '@config/typeorm.config';
import { HealthModule } from '@modules/health/health.module';
import { SharedBaseModule } from '@shared';

@Module({
  imports: [
    HealthModule,
    TypeOrmModule.forRoot(AppDataSource.options),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    SharedBaseModule.forRoot(),
    // Feature modules would go here
    // UserModule,
    // AuthModule,
    // etc.
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
