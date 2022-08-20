import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSourceService } from '../data-source/data-source.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { RedisStorageKeysEnum } from '../common/consts/redis-storage-keys.enum';
import { QueuesEnum } from '../common/consts/queues.enum';
import { JobsEnum } from '../common/consts/jobs.enum';
import { CustomLogger } from '../logger/custom.logger';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class OrdersService implements OnModuleInit {
  constructor(
    private readonly dataSourceService: DataSourceService,
    @InjectQueue(QueuesEnum.INTERNAL_ORDERS_READ_QUEUE)
    private ordersReadQueue: Queue,
    @InjectRedis() private readonly redis: Redis,
    private readonly logger: CustomLogger,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.scheduleOrderRead();
  }

  async getNumberOfLastReadPage(): Promise<number | null> {
    const numberOfLastReadPage = await this.redis.get(
      RedisStorageKeysEnum.LAST_READ_PAGE,
    );

    return numberOfLastReadPage ? Number(numberOfLastReadPage) : null;
  }

  async setNumberOfLastReadPage(pageNumber: number) {
    await this.redis.set(RedisStorageKeysEnum.LAST_READ_PAGE, pageNumber);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async scheduleOrderRead() {
    this.logger.log('Scheduling orders fetch');
    const numberOfLastReadPage = await this.getNumberOfLastReadPage();
    const count = await this.ordersReadQueue.getActiveCount();
    if (count > 0) {
      this.logger.log('Fetch is already in progress, skipping');
      return;
    }
    if (numberOfLastReadPage === null) {
      await this.setNumberOfLastReadPage(0);
      return this.addReadOrderJob(0);
    }
    return this.addReadOrderJob(numberOfLastReadPage);
  }

  async addReadOrderJob(lastReadPage: number) {
    await this.ordersReadQueue.add(
      JobsEnum.READ_ORDER_JOB,

      {
        startPage: lastReadPage + 1,
      },
      {
        removeOnComplete: true,
        attempts: 10,
      },
    );
  }
}
