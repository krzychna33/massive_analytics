import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment } from '../config/types/environment.type';
import { CustomLogger } from '../logger/custom.logger';
import { OrderType } from '../common/types/order.type';

@Injectable()
export class DataSourceService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<Environment>,
    private readonly logger: CustomLogger,
  ) {
    this.httpService.axiosRef.interceptors.request.use((request) => {
      this.logger.log(`HTTP Request: ${request.method} - ${request.url}`);
      return request;
    });
  }

  private getBaseUrl(): string {
    return this.configService.get<string>('dataSourceUrl');
  }

  public async fetchOrders({
    page = 1,
    limit = 10,
  }: { page?: number; limit?: number } = {}): Promise<OrderType[]> {
    const queryParams = new URLSearchParams({
      _page: `${page}`,
      _limit: `${limit}`,
    });

    if (page > 9) {
      return [];
    }

    const response = await this.httpService.axiosRef.get(
      `${this.getBaseUrl()}/orders?${queryParams.toString()}`,
    );
    return response.data;
  }
}
