// src/config/data-source.ts
import { DataSource, DataSourceOptions } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";
import { Category } from "../entities/category.entity";
import { Product } from "../entities/product.entity";
import { Order } from "../entities/order.entity";

// Carga las variables de entorno
config();
const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  // production
  type: "postgres",
  host: configService.get("DATABASE_HOST", "shuttle.proxy.rlwy.net"),
  port: configService.get("DATABASE_PORT", 14371),
  username: configService.get("DATABASE_USERNAME", "postgres"),
  password: configService.get(
    "DATABASE_PASSWORD",
    "cMpLQVsWwlwvvEEGoUsAxfLhHnFbzrbf"
  ),
  database: configService.get("DATABASE_NAME", "railway"),

  // desarrollo
  // host: configService.get("DATABASE_HOST", "localhost"),
  // port: configService.get("DATABASE_PORT", 5432),
  // username: configService.get("DATABASE_USERNAME", "postgres"),
  // password: configService.get(
  //   "DATABASE_PASSWORD",
  //   "2980"
  // ),
  // database: configService.get("DATABASE_NAME", "pizza"),

  entities: [Category, Order, Product],
  migrations: ["src/migrations/*.ts"],
  synchronize: false,
  logging: true,
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
