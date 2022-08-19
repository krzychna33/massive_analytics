import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSourceService } from '../data-source/data-source.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { RedisStorageKeysEnum } from '../common/consts/redis-storage-keys.enum';
import { QueuesEnum } from '../common/consts/queues.enum';
import { JobsEnum } from '../common/consts/jobs.enum';

@Injectable()
export class OrdersService implements OnModuleInit {
  constructor(
    private readonly dataSourceService: DataSourceService,
    @InjectQueue(QueuesEnum.INTERNAL_ORDERS_READ_QUEUE)
    private ordersReadQueue: Queue,
    @InjectRedis() private readonly redis: Redis,
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

  async scheduleOrderRead() {
    const numberOfLastReadPage = await this.getNumberOfLastReadPage();
    const count = await this.ordersReadQueue.getActiveCount();
    if (count > 0) {
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
