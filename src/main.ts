import { NestFactory } from "@nestjs/core";
import { setupSwagger } from "./config/swaggerConfig";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // habilito cors para permitir la comunicación entre la aplicación y el cliente
  app.enableCors({
    // origin: "*", // cualquier sitio puede acceder
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 200,
  });
  // configuramos el validador de datos
  app.useGlobalPipes(new ValidationPipe());

  // configuro Swagger
  setupSwagger(app);
  // Escuchar de todas las interfaces y puertos
  await app.listen(3000, "0.0.0.0");
  console.log(`La aplicacion esta escuchando en ${await app.getUrl()}`);
  console.log(`Swagger Disponible en ${await app.getUrl()}/api`);
  console.log("Para Exponer el tunel ejecute: lt --port 4000");
}
bootstrap();
