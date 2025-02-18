// src/config/data-source.ts
import { DataSource, DataSourceOptions } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";
import { Category } from "../entities/category.entity";
import { Product } from "../entities/product.entity";

// Carga las variables de entorno
config();
const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: configService.get("DATABASE_HOST", "localhost"),
  port: configService.get("DATABASE_PORT", 5432),
  username: configService.get("DATABASE_USERNAME", "postgres"),
  password: configService.get("DATABASE_PASSWORD", "2980"),
  database: configService.get("DATABASE_NAME", "pizza"),
  entities: [Category, Product],
  migrations: ["src/migrations/*.ts"],
  synchronize: false,
  logging: true,
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;

// // src/config/data-source.ts
// import { DataSource } from "typeorm";
// import { Category } from "../entities/category.entity";
// import { Product } from "../entities/product.entity";
// import { Order } from "../entities/order.entity";

// export const AppDataSource = new DataSource({
//   type: "postgres",
//   host: "localhost",
//   port: 5432,
//   username: "postgres", // tu usuario
//   password: "2980", // tu contraseña
//   database: "pizza", // tu base de datos
//   entities: [Category, Order, Product],
//   migrations: ["src/migrations/*.ts"],
//   synchronize: false,
//   logging: true,
// });

// // Exportamos la instancia de DataSource
// export default AppDataSource;
