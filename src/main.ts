import { NestFactory } from "@nestjs/core";
import { setupSwagger } from "./config/swaggerConfig";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // configuro Swagger
  setupSwagger(app);
  await app.listen(3000);
}
bootstrap();
