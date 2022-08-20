import { Module } from '@nestjs/common';
import { DataSourceModule } from './data-source/data-source.module';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './logger/logger.module';
import environment from './config/environment';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [environment],
    }),
    ScheduleModule.forRoot(),
    DataSourceModule,
    OrdersModule,
    LoggerModule,
    RedisModule.forRoot({
      config: {
        host: 'flip-redis-storage',
        port: 6379,
      },
    }),
  ],
})
export class AppModule {}
