import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { configVariables } from '@shared';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit(): Promise<void> {
    try {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }

      await this.dataSource.query('SELECT 1');

      this.logger.log(
        `Connected to database: ${configVariables.database.name}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to connect to database: ${configVariables.database.name}`,
      );
      this.logger.error(error);

      throw error;
    }
  }
}
