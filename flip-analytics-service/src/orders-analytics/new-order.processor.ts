import { Process, Processor } from '@nestjs/bull';
import { QueuesEnum } from '../common/consts/queues.enum';
import { JobsEnum } from '../common/consts/jobs.enum';
import { Job } from 'bull';
import { OrderType } from '../common/types/order.type';
import { NewOrderStreamJobDataType } from '../common/types/new-order-stream-job-data.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository, DataSource } from 'typeorm';
import { DateTime } from 'luxon';
import { Product } from './entities/product.entity';
import { ProductOrder } from './entities/product-order.entity';
import { ProductStatistic } from './entities/product-statistic.entity';

@Processor(QueuesEnum.EXTERNAL_NEW_ORDERS_STREAM_QUEUE)
export class NewOrderProcessor {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductOrder)
    private readonly productOrderRepository: Repository<ProductOrder>,
    @InjectRepository(ProductStatistic)
    private readonly productStatisticRepository: Repository<ProductStatistic>,
    private dataSource: DataSource,
  ) {}

  @Process(JobsEnum.NEW_ORDER_STREAM_JOB)
  async processNewOrderAnalytic({ data }: Job<NewOrderStreamJobDataType>) {
    const { products, productOrders } = this.unpackOrder(data.order);
    console.log(`processing order ${data.order.id}`);
    await this.insertOrIgnoreOrder(data.order.id, data.order.date);
    await this.insertOrIgnoreProducts(products);
    await this.saveOrderDependencies(productOrders);
  }

  async saveOrderDependencies(productOrders: ProductOrder[]) {
    for (const productOrder of productOrders) {
      await this.saveProductOrderAndUpdateStatistic(productOrder);
    }
  }

  async findLastDayProductOrderCount(productId: string): Promise<number> {
    const connectionManager = this.productOrderRepository.manager;

    const [{ orderCount }] = await connectionManager.query(`
      SELECT COUNT(id) as "orderCount"
      FROM product_order
      WHERE "productId" = '${productId}'
          AND "purchaseDate" > (current_date - INTERVAL '1 day')::date
    `);

    return orderCount;
  }

  async saveProductOrderAndUpdateStatistic(productOrder: ProductOrder) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(productOrder);
      const productStatistic = await this.productStatisticRepository.findOneBy({
        productId: productOrder.productId,
      });

      if (!productStatistic) {
        const newProductStatistic = new ProductStatistic();
        newProductStatistic.productId = productOrder.productId;
        newProductStatistic.totalSaleValue = productOrder.totalPrice;
        newProductStatistic.totalOrderCount = 1;
        newProductStatistic.totalOrderCountLastDay =
          DateTime.fromJSDate(productOrder.purchaseDate) <
          DateTime.now().minus({ day: 1 })
            ? 0
            : 1;
        await queryRunner.manager.save(newProductStatistic);
      } else {
        productStatistic.totalSaleValue =
          Number(productStatistic.totalSaleValue) +
          Number(productOrder.totalPrice);
        productStatistic.totalOrderCount += 1;
        productStatistic.totalOrderCountLastDay =
          await this.findLastDayProductOrderCount(productOrder.productId);
        await queryRunner.manager.save(productStatistic);
      }
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async insertOrIgnoreOrder(orderId: string, orderDate: string) {
    const newOrder = new Order();
    newOrder.id = orderId;
    newOrder.purchaseDate = DateTime.fromISO(orderDate).toJSDate();

    const queryBuilder = this.orderRepository.manager.createQueryBuilder();
    return queryBuilder
      .insert()
      .into(Order)
      .values(newOrder)
      .orIgnore()
      .execute();
  }

  async insertOrIgnoreProducts(products: Product[]) {
    const queryBuilder = this.orderRepository.manager.createQueryBuilder();
    return queryBuilder
      .insert()
      .into(Product)
      .values(products)
      .orIgnore()
      .execute();
  }

  unpackOrder(order: OrderType): {
    products: Product[];
    productOrders: ProductOrder[];
  } {
    const products = order.items.map((item) => {
      const product = new Product();
      product.id = item.product.id;
      product.name = item.product.name;
      return product;
    });

    const productOrdersWithDuplicates = order.items.map((item) => {
      const productOrder = new ProductOrder();
      productOrder.orderId = order.id;
      productOrder.productId = item.product.id;
      productOrder.purchaseDate = DateTime.fromISO(order.date).toJSDate();
      productOrder.quantity = item.quantity;
      productOrder.unitPrice = Number(item.product.price);
      productOrder.totalPrice =
        Number(item.product.price) * Number(item.quantity);

      return productOrder;
    });

    const productOrdersWithoutDuplicates = Array.from(
      new Set(productOrdersWithDuplicates.map((item) => item.productId)),
    ).map((productId) => {
      return this.productOrderRepository.create({
        ...productOrdersWithDuplicates.find(
          (item) => item.productId === productId,
        ),
        quantity: productOrdersWithDuplicates
          .filter((item) => item.productId === productId)
          .reduce((accumulator, item) => accumulator + item.quantity, 0),
        totalPrice: productOrdersWithDuplicates
          .filter((item) => item.productId === productId)
          .reduce((accumulator, item) => accumulator + item.totalPrice, 0),
      });
    });

    return { products, productOrders: productOrdersWithoutDuplicates };
  }
}
