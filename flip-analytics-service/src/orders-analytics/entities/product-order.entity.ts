import { Product } from './product.entity';
import { Order } from './order.entity';
import {
  Entity,
  ManyToOne,
  JoinColumn,
  Column,
  Unique,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

@Entity()
@Unique('uniqueProductOrderConstraint', ['productId', 'orderId'])
export class ProductOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @Column()
  orderId: string;

  @Index()
  @Column({ type: 'timestamptz' })
  purchaseDate: Date;

  @Column({ type: 'decimal' })
  quantity: number;

  @Column({ type: 'decimal' })
  totalPrice: number;

  @ManyToOne((type) => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne((type) => Order)
  @JoinColumn({ name: 'orderId' })
  order: Order;
}
