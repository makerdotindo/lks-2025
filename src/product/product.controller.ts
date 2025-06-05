import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AdminGuard, UserGuard } from '@/auth/auth.guard';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductResponseDto } from './dto/response.dto';

@ApiTags('Products')
@ApiBearerAuth('Token')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiExcludeEndpoint()
  @UseGuards(AdminGuard)
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @ApiResponse({
    status: 200,
    description: 'Returns the list of products',
    schema: {
      properties: {
        message: { example: 'Message show here' },
        error: { example: null },
        data: {
          example: [
            {
              id: 1,
              name: 'Product One',
              price: 12000,
              image: 'https://example.com/image1.jpg',
              rating: 4.8,
            },
            {
              id: 2,
              name: 'Product Two',
              price: 8500,
              image: 'https://example.com/image2.jpg',
              rating: 4.2,
            },
          ],
        },
      },
    },
  })
  @UseGuards(UserGuard)
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @UseGuards(UserGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @ApiExcludeEndpoint()
  @UseGuards(AdminGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  @ApiExcludeEndpoint()
  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
