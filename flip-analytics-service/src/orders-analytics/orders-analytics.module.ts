import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueuesEnum } from '../common/consts/queues.enum';
import { NewOrderProcessor } from './new-order.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueuesEnum.EXTERNAL_NEW_ORDERS_STREAM_QUEUE,
      redis: {
        port: 6379,
        host: 'flip-redis-bus',
      },
    }),
  ],
  providers: [NewOrderProcessor],
})
export class OrdersAnalyticsModule {}
