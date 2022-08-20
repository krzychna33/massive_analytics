import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ProductStatisticResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  productId: string;

  @ApiProperty()
  @Expose()
  totalSaleValue: string;

  @ApiProperty()
  @Expose()
  totalOrderCount: number;

  @ApiProperty()
  @Expose()
  totalOrderCountLastDay: number;
}
