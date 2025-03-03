"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = exports.whatsappConfig = exports.databaseConfig = void 0;
const config_1 = require("@nestjs/config");
exports.databaseConfig = (0, config_1.registerAs)("database", () => ({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "2980",
    database: process.env.DB_DATABASE || "pizza",
    synchronize: process.env.DB_SYNCHRONIZE === "true",
}));
exports.whatsappConfig = (0, config_1.registerAs)("whatsapp", () => ({
    businessPhone: process.env.WHATSAPP_BUSINESS_PHONE,
    apiKey: process.env.WHATSAPP_API_KEY,
    apiUrl: process.env.WHATSAPP_API_URL,
}));
exports.appConfig = (0, config_1.registerAs)("app", () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    environment: process.env.NODE_ENV || "development",
}));
//# sourceMappingURL=env.config.js.map