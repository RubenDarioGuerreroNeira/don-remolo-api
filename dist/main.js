"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swaggerConfig_1 = require("./config/swaggerConfig");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 200,
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    (0, swaggerConfig_1.setupSwagger)(app);
    await app.listen(3000, "0.0.0.0");
    console.log(`La aplicacion esta escuchando en ${await app.getUrl()}`);
    console.log(`Swagger Disponible en ${await app.getUrl()}/api`);
    console.log("Para Exponer el tunel ejecute: lt --port 4000");
}
bootstrap();
//# sourceMappingURL=main.js.map