import { Module } from '@nestjs/common';
import { OrdersAnalyticsModule } from './orders-analytics/orders-analytics.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import environment from './config/environment';
import { Environment } from './config/types/environment.type';
import { Order } from './orders-analytics/entities/order.entity';
import { Product } from './orders-analytics/entities/product.entity';
import { ProductOrder } from './orders-analytics/entities/product-order.entity';
import { ProductStatistic } from './orders-analytics/entities/product-statistic.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [environment],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<Environment>) => ({
        type: 'postgres',
        host: config.get('dbHost'),
        port: config.get('dbPort'),
        username: config.get('dbUser'),
        password: config.get('dbPassword'),
        database: config.get('dbName'),
        entities: [Order, Product, ProductOrder, ProductStatistic],
        synchronize: true,
      }),
    }),
    OrdersAnalyticsModule,
  ],
})
export class AppModule {}
