import { Controller, Get } from '@nestjs/common';
import { OrderAnalyticsService } from './order-analytics.service';
import { ProductStatisticResponseDto } from './dto/product-statistic.response.dto';
import { plainToInstance } from 'class-transformer';
import { ApiResponse } from '@nestjs/swagger';

@Controller('order-analytics')
export class OrderAnalyticsController {
  constructor(private readonly orderAnalyticsService: OrderAnalyticsService) {}

  @Get('top-profitable-products')
  @ApiResponse({
    status: 200,
    type: ProductStatisticResponseDto,
    isArray: true,
  })
  async getTopProfitableProducts(): Promise<ProductStatisticResponseDto[]> {
    const productStatistics =
      await this.orderAnalyticsService.getTopProfitableProducts();

    return productStatistics.map((productStatistic) => {
      return plainToInstance(ProductStatisticResponseDto, productStatistic);
    });
  }

  @Get('top-bought-products')
  @ApiResponse({
    status: 200,
    type: ProductStatisticResponseDto,
    isArray: true,
  })
  async getTopBoughtProducts(): Promise<ProductStatisticResponseDto[]> {
    const productStatistics =
      await this.orderAnalyticsService.getTopBoughtProducts();

    return productStatistics.map((productStatistic) => {
      return plainToInstance(ProductStatisticResponseDto, productStatistic);
    });
  }

  @Get('top-bought-products-yesterday')
  @ApiResponse({
    status: 200,
    type: ProductStatisticResponseDto,
    isArray: true,
  })
  async getTopBoughtProductsYesterday(): Promise<
    ProductStatisticResponseDto[]
  > {
    const productStatistics =
      await this.orderAnalyticsService.getTopBoughtProductsYesterday();

    return productStatistics.map((productStatistic) => {
      return plainToInstance(ProductStatisticResponseDto, productStatistic);
    });
  }
}
