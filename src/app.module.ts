// src/app.module.ts
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsModule } from "./products/products.module";
import { CategoriesModule } from "./categories/categories.module";
import { OrdersModule } from "./orders/orders.module";
import { WhatsappModule } from "./whatsapp/whatsapp.module";
import { databaseConfig, whatsappConfig, appConfig } from "./config/env.config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { dataSourceOptions } from "./config/data-source";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, whatsappConfig, appConfig],
      envFilePath: `.env.${process.env.NODE_ENV || "development"}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService
      ): Promise<TypeOrmModuleOptions> => ({
        ...dataSourceOptions, // Usamos la configuración base
        entities: [__dirname + "/**/*.entity{.ts,.js}"], // Sobrescribimos la configuración de entidades
        synchronize: configService.get<boolean>("database.synchronize", false),
        autoLoadEntities: true,
      }),
    }),
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    WhatsappModule,
  ],
})
export class AppModule {}
