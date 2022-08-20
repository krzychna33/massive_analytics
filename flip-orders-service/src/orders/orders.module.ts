import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { DataSourceModule } from '../data-source/data-source.module';
import { BullModule } from '@nestjs/bull';
import { ReadOrdersProcessor } from './read-orders.processor';
import { QueuesEnum } from '../common/consts/queues.enum';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    DataSourceModule,
    LoggerModule,
    BullModule.registerQueue({
      name: QueuesEnum.INTERNAL_ORDERS_READ_QUEUE,
      redis: {
        port: 6379,
        host: 'flip-redis-storage',
      },
    }),
    BullModule.registerQueue({
      name: QueuesEnum.EXTERNAL_NEW_ORDERS_STREAM_QUEUE,
      redis: {
        port: 6379,
        host: 'flip-redis-bus',
      },
    }),
  ],
  providers: [OrdersService, ReadOrdersProcessor],
})
export class OrdersModule {}
