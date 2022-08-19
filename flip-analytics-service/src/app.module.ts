import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersAnalyticsModule } from './orders-analytics/orders-analytics.module';

@Module({
  imports: [OrdersAnalyticsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
