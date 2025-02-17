import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ProductsModule } from "./products/products.module";
import { CategoriesModule } from "./categories/categories.module";
import { OrdersModule } from "./orders/orders.module";
import { WhatsappModule } from "./whatsapp/whatsapp.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "2980",
      database: "pizza",
      entities: [__dirname + "/**/*,entity{.ts,.js}"],
      synchronize: true, // set false in production
    }),
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    WhatsappModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
