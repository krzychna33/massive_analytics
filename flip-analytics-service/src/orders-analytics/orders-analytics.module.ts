import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueuesEnum } from '../common/consts/queues.enum';
import { NewOrderProcessor } from './new-order.processor';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductStatistic } from './entities/product-statistic.entity';
import { Product } from './entities/product.entity';
import { ProductOrder } from './entities/product-order.entity';
import { OrderAnalyticsService } from './order-analytics.service';
import { OrderAnalyticsController } from './order-analytics.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, ProductStatistic, Product, ProductOrder]),
    BullModule.registerQueue({
      name: QueuesEnum.EXTERNAL_NEW_ORDERS_STREAM_QUEUE,
      redis: {
        port: 6379,
        host: 'flip-redis-bus',
      },
    }),
  ],
  providers: [NewOrderProcessor, OrderAnalyticsService],
  controllers: [OrderAnalyticsController],
})
export class OrdersAnalyticsModule {}
