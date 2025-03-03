"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSourceOptions = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("@nestjs/config");
const dotenv_1 = require("dotenv");
const category_entity_1 = require("../entities/category.entity");
const product_entity_1 = require("../entities/product.entity");
const order_entity_1 = require("../entities/order.entity");
(0, dotenv_1.config)();
const configService = new config_1.ConfigService();
exports.dataSourceOptions = {
    type: "postgres",
    host: configService.get("DATABASE_HOST", "localhost"),
    port: configService.get("DATABASE_PORT", 5432),
    username: configService.get("DATABASE_USERNAME", "postgres"),
    password: configService.get("DATABASE_PASSWORD", "2980"),
    database: configService.get("DATABASE_NAME", "pizza"),
    entities: [category_entity_1.Category, order_entity_1.Order, product_entity_1.Product],
    migrations: ["src/migrations/*.ts"],
    synchronize: false,
    logging: true,
};
const AppDataSource = new typeorm_1.DataSource(exports.dataSourceOptions);
exports.default = AppDataSource;
//# sourceMappingURL=data-source.js.map