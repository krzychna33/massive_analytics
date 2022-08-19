import { Controller, Get } from '@nestjs/common';
import { OrderAnalyticsService } from './order-analytics.service';

@Controller('order-analytics')
export class OrderAnalyticsController {
  constructor(private readonly orderAnalyticsService: OrderAnalyticsService) {}
  @Get('top-profitable-products')
  getTopProfitableProducts() {
    return this.orderAnalyticsService.getTopProfitableProducts();
  }

  @Get('top-bought-products')
  getTopBoughtProducts() {
    return this.orderAnalyticsService.getTopBoughtProducts();
  }

  @Get('top-bought-products-yesterday')
  getTopBoughtProductsYesterday() {
    return this.orderAnalyticsService.getTopBoughtProductsYesterday();
  }
}
