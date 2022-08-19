import { Process, Processor } from '@nestjs/bull';
import { QueuesEnum } from '../common/consts/queues.enum';
import { JobsEnum } from '../common/consts/jobs.enum';
import { Job } from 'bull';
import { OrderType } from '../common/types/order.type';
import { NewOrderStreamJobDataType } from '../common/types/new-order-stream-job-data.type';

@Processor(QueuesEnum.EXTERNAL_NEW_ORDERS_STREAM_QUEUE)
export class NewOrderProcessor {
  @Process(JobsEnum.NEW_ORDER_STREAM_JOB)
  processNewOrderAnalytic(job: Job<NewOrderStreamJobDataType>) {
    this.unpackProducts(job.data.order);
  }

  unpackProducts(order: OrderType) {
    let totalOrderValue = 0;
    for (const item of order.items) {
      const productValue = Number(item.product.price) * item.quantity;
      totalOrderValue += productValue;
    }

    console.log(`${order.id} value is ${totalOrderValue}`);
  }
}
