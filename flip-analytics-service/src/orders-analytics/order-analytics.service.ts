import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductStatistic } from './entities/product-statistic.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderAnalyticsService {
  constructor(
    @InjectRepository(ProductStatistic)
    private readonly productStatisticRepository: Repository<ProductStatistic>,
  ) {}
  async getTopProfitableProducts() {
    const record = await this.productStatisticRepository.find({
      order: { totalSaleValue: 'DESC' },
      take: 10,
    });

    return record;
  }

  async getTopBoughtProducts() {
    const record = await this.productStatisticRepository.find({
      order: { totalOrderCount: 'DESC' },
      take: 10,
    });

    return record;
  }

  async getTopBoughtProductsYesterday() {
    const record = await this.productStatisticRepository.find({
      order: { totalOrderCountLastDay: 'DESC' },
      take: 10,
    });

    return record;
  }
}
