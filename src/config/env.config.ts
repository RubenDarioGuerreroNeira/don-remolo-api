// src/config/env.config.ts
import { registerAs } from "@nestjs/config";

export const databaseConfig = registerAs("database", () => ({
  type: "postgres" as const, // Especificamos el tipo explícitamente
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "2980",
  database: process.env.DB_DATABASE || "pizza",
  synchronize: process.env.DB_SYNCHRONIZE === "true",
}));

export const whatsappConfig = registerAs("whatsapp", () => ({
  businessPhone: process.env.WHATSAPP_BUSINESS_PHONE,
  apiKey: process.env.WHATSAPP_API_KEY,
  apiUrl: process.env.WHATSAPP_API_URL,
}));

export const appConfig = registerAs("app", () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  environment: process.env.NODE_ENV || "development",
}));
