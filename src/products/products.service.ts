import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';
@Injectable()
export class ProductsService {

    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
      ) {}
    
      async findAll(): Promise<Product[]> {
        return this.productsRepository.find({ relations: ['category'] });
      }
    
      async findByCategory(categoryId: number): Promise<Product[]> {
        return this.productsRepository.find({
          where: { category: { id: categoryId } },
          relations: ['category'],
        });
      }
    }



