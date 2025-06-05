import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  create(dto: CreateProductDto) {
    const product = this.productRepo.create(dto);
    const result = this.productRepo.save(product);

    if (!result) {
      throw new InternalServerErrorException('Failed to create product');
    }

    return {
      message: 'Product created successfully',
      error: null,
      data: result,
    };
  }

  async findAll() {
    const products = await this.productRepo.find();

    if (products.length === 0) {
      throw new NotFoundException({
        message: 'No products found',
        error: 'Not Found',
        data: null,
      });
    }

    return {
      message: 'Products found successfully',
      error: null,
      data: products,
    };
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException({
        message: `Product with id ${id} not found`,
        error: 'Not Found',
        data: null,
      });
    }

    return {
      message: `Product with id ${id} found successfully`,
      error: null,
      data: product,
    };
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = this.productRepo.create(dto);
    product.id = id;

    const result = await this.productRepo.save(product);

    if (!result) {
      throw new InternalServerErrorException(
        `Failed to update product with id ${id}`,
      );
    }

    return {
      messsage: `Product with id ${id} updated successfully`,
      error: null,
      data: result,
    };
  }

  async remove(id: number) {
    const product = await this.productRepo.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    const result = await this.productRepo.delete(id);

    if (result.affected === 0) {
      throw new InternalServerErrorException(
        `Failed to delete product with id ${id}`,
      );
    }

    return {
      message: `Product with id ${id} deleted successfully`,
      error: null,
      data: null,
    };
  }
}
