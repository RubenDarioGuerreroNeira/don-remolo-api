"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../entities/product.entity");
const category_entity_1 = require("../entities/category.entity");
let ProductsService = class ProductsService {
    constructor(productsRepository, categoriesRepository) {
        this.productsRepository = productsRepository;
        this.categoriesRepository = categoriesRepository;
    }
    async create(createProductsDto) {
        const existingProduct = await this.productsRepository.findOne({
            where: { name: createProductsDto.name },
        });
        if (existingProduct) {
            throw new common_1.ConflictException("Product already exists");
        }
        if (createProductsDto.stockIn < 0) {
            throw new common_1.BadRequestException("StockIn must be greater than 0");
        }
        const category = await this.categoriesRepository.findOne({
            where: { id: createProductsDto.categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${createProductsDto.categoryId} not found`);
        }
        const product = this.productsRepository.create({
            ...createProductsDto,
            category: { id: createProductsDto.categoryId },
        });
        return this.productsRepository.save(product);
    }
    async findAll(paginationDto) {
        const { page = 1, limit = 10 } = paginationDto || {};
        const [items, total] = await this.productsRepository.findAndCount({
            relations: ["category"],
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            items,
            total,
            page,
            limit,
        };
    }
    async findOne(id) {
        const product = await this.productsRepository.findOne({
            where: { id },
            relations: ["category"],
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async findByCategory(categoryId, paginationDto) {
        const { page = 1, limit = 10 } = paginationDto || {};
        const category = await this.categoriesRepository.findOne({
            where: { id: categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${categoryId} not found`);
        }
        const [items, total] = await this.productsRepository.findAndCount({
            where: { category: { id: categoryId } },
            relations: ["category"],
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            items,
            total,
            page,
            limit,
        };
    }
    async update(id, updateProductsDto) {
        const product = await this.productsRepository.findOne({
            where: { id },
            relations: ["category"],
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        if (updateProductsDto.categoryId) {
            const category = await this.categoriesRepository.findOne({
                where: { id: updateProductsDto.categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException(`Category with ID ${updateProductsDto.categoryId} not found`);
            }
        }
        const productToUpdate = Object.entries(updateProductsDto)
            .filter(([key, value]) => value !== undefined && key !== "categoryId")
            .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
        if (Object.keys(productToUpdate).length > 0) {
            await this.productsRepository.update(id, productToUpdate);
        }
        if (updateProductsDto.categoryId) {
            await this.productsRepository.save({
                id,
                category: { id: updateProductsDto.categoryId },
            });
        }
        return this.productsRepository.findOne({
            where: { id },
            relations: ["category"],
        });
    }
    async remove(id) {
        const product = await this.productsRepository.findOne({
            where: { id },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        await this.productsRepository.delete(id);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map