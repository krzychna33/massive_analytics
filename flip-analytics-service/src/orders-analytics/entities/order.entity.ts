import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Order {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'timestamptz' })
  purchaseDate: Date;
}
