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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const category_entity_1 = require("../entities/category.entity");
const typeorm_2 = require("typeorm");
let CategoriesService = class CategoriesService {
    constructor(categoriesRepository) {
        this.categoriesRepository = categoriesRepository;
    }
    async validateCategories(category) {
        if (!category.name) {
            throw new Error("Category name is required");
        }
        const categories = await this.categoriesRepository.findOne({
            where: { name: category.name },
        });
        if (categories) {
            throw new Error("Category already exists");
        }
    }
    async create(createCategoryDto) {
        try {
            await this.validateCategories(createCategoryDto);
            const savedCategory = await this.categoriesRepository.save(createCategoryDto);
            return {
                data: savedCategory,
                message: "Category created successfully",
                status: 200,
            };
        }
        catch (err) {
            return {
                data: null,
                message: err.message,
                status: 400,
            };
        }
    }
    async findAll() {
        return this.categoriesRepository.find();
    }
    async findByProduct(productId) {
        return this.categoriesRepository.find({
            relations: ["products"],
            where: { products: { id: productId } },
        });
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map