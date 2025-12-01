import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import si from 'systeminformation';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { HealthComponentStatusDto, HealthResponseDto } from './model';
import { EHealthCheck } from './enum';

@Injectable()
export class HealthService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {
    this.logger.setContext(HealthService.name);
  }

  async check(): Promise<HealthResponseDto> {
    const timestamp = new Date().toISOString();

    const components: Record<string, HealthComponentStatusDto> = {
      database: { status: EHealthCheck.UNAVAILABLE },
      cpu: { status: EHealthCheck.UNAVAILABLE },
      memory: { status: EHealthCheck.UNAVAILABLE },
    };

    try {
      components.database.status = await this.checkDatabase();
      components.cpu.status = await this.checkCpu();
      components.memory.status = await this.checkMemory();

      const status = Object.values(components).every(
        (c) => c.status === EHealthCheck.UP,
      )
        ? EHealthCheck.UP
        : EHealthCheck.DOWN;

      this.logger.info('Health check performed', { status, components });

      return { status, timestamp, components };
    } catch (error) {
      this.logger.error('Health check failed', {
        message: error instanceof Error ? error.message : String(error),
      });

      return { status: EHealthCheck.DOWN, timestamp, components };
    }
  }

  private async checkDatabase(): Promise<EHealthCheck> {
    try {
      await this.dataSource.query('SELECT 1');
      return EHealthCheck.UP;
    } catch {
      return EHealthCheck.DOWN;
    }
  }

  private async checkCpu(): Promise<EHealthCheck> {
    try {
      const cpu = await si.currentLoad();
      return cpu.currentLoad < 90 ? EHealthCheck.UP : EHealthCheck.DOWN;
    } catch {
      return EHealthCheck.DOWN;
    }
  }

  private async checkMemory(): Promise<EHealthCheck> {
    try {
      const mem = await si.mem();
      return mem.free > 100 * 1024 * 1024 ? EHealthCheck.UP : EHealthCheck.DOWN;
    } catch {
      return EHealthCheck.DOWN;
    }
  }
}
