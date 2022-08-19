import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { OrdersService } from './orders.service';
import { Job, Queue } from 'bull';
import { DataSourceService } from '../data-source/data-source.service';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { QueuesEnum } from '../common/consts/queues.enum';
import { JobsEnum } from '../common/consts/jobs.enum';
import { NewOrderStreamJobType } from '../common/types/new-order-stream-job.type';
import { OrderReadJobDataType } from '../common/types/order-read-job-data.type';

@Processor(QueuesEnum.INTERNAL_ORDERS_READ_QUEUE)
export class ReadOrdersProcessor {
  constructor(
    private readonly dataSourceService: DataSourceService,
    @InjectQueue(QueuesEnum.INTERNAL_ORDERS_READ_QUEUE)
    private ordersReadQueue: Queue<OrderReadJobDataType>,
    @InjectQueue(QueuesEnum.EXTERNAL_NEW_ORDERS_STREAM_QUEUE)
    private externalNewOrdersStreamQueue: Queue<NewOrderStreamJobType>,
    @InjectRedis() private readonly redis: Redis,
    private readonly ordersService: OrdersService,
  ) {}

  @Process(JobsEnum.READ_ORDER_JOB)
  async handleQueuedJob(job: Job<OrderReadJobDataType>) {
    const orders = await this.dataSourceService.fetchOrders({
      page: job.data.startPage,
      limit: 10,
    });

    if (!orders.length) {
      return this.ordersService.setNumberOfLastReadPage(job.data.startPage - 1);
    }

    console.log(
      `Fetched ${orders.length} for page number ${job.data.startPage}`,
    );

    for (const order of orders) {
      await this.externalNewOrdersStreamQueue.add(
        JobsEnum.NEW_ORDER_STREAM_JOB,
        {
          order,
        },
      );
      console.log('pushed to queue');
    }

    const nextPageOfOrders = await this.dataSourceService.fetchOrders({
      page: job.data.startPage,
      limit: 10,
    });

    if (nextPageOfOrders.length) {
      return this.ordersReadQueue.add(
        JobsEnum.READ_ORDER_JOB,
        {
          startPage: job.data.startPage + 1,
        },
        {
          removeOnComplete: true,
          attempts: 10,
        },
      );
    }

    await this.ordersService.setNumberOfLastReadPage(job.data.startPage);
  }
}
