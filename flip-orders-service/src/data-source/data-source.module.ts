import { Module } from '@nestjs/common';
import { DataSourceService } from './data-source.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [ConfigModule, HttpModule, LoggerModule],
  providers: [DataSourceService],
  exports: [DataSourceService],
})
export class DataSourceModule {}
