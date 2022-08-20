import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductStatistic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @Index()
  @Column({ type: 'decimal' })
  totalSaleValue: number;

  @Index()
  @Column({ type: 'int' })
  totalOrderCount: number;

  @Index()
  @Column({ type: 'int' })
  totalOrderCountLastDay: number;

  @OneToOne((type) => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;
}
