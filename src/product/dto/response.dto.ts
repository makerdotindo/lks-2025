import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({ type: 'integer', example: 1 })
  id: number;

  @ApiProperty({ type: 'string', example: 'Product Name' })
  name: string;

  @ApiProperty({ type: 'integer', example: 7000 })
  price: number;

  @ApiProperty({ type: 'string', example: 'https://example.com/image.jpg' })
  image: string;

  @ApiProperty({ type: 'number', example: 4.5 })
  rating: number;
}
