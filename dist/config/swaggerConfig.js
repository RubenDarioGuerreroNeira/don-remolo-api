"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_1 = require("@nestjs/swagger");
const setupSwagger = (app) => {
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Don Remolo API")
        .setDescription("Documentación de la API de Don Remolo")
        .setVersion("1.0")
        .addBearerAuth({
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
    }, "JWT-auth")
        .addTag("auth", "Endpoints de autenticación")
        .addTag("users", "Endpoints de usuarios")
        .addTag("products", "Endpoints de productos")
        .addTag("orders", "Endpoints de órdenes")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("api/docs", app, document);
};
exports.setupSwagger = setupSwagger;
//# sourceMappingURL=swaggerConfig.js.map