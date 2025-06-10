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
  Ip,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AdminGuard, APIGuard, UserGuard } from '@/auth/auth.guard';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { LoggerService } from '@/logger/logger.service';
import { Request } from 'express';

@ApiTags('Products')
@ApiBearerAuth('Token')
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly loggerService: LoggerService,
  ) {}

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
  @UseGuards(APIGuard, UserGuard)
  @Get()
  findAll(@Req() req: Request) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown User Agent';
    this.loggerService.log(
      `[IP: ${ip}] : [User Agent: ${userAgent}] : /products : user requested product list`,
    );
    return this.productService.findAll();
  }

  @UseGuards(APIGuard, UserGuard)
  @Get(':id')
  findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown User Agent';
    this.loggerService.log(
      `[IP: ${ip}] : [User Agent: ${userAgent}] : /products/${id} : user requested product details for ID ${id}`,
    );
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
