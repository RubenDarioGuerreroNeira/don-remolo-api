export declare const databaseConfig: (() => {
    type: "postgres";
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    synchronize: boolean;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    type: "postgres";
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    synchronize: boolean;
}>;
export declare const whatsappConfig: (() => {
    businessPhone: string;
    apiKey: string;
    apiUrl: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    businessPhone: string;
    apiKey: string;
    apiUrl: string;
}>;
export declare const appConfig: (() => {
    port: number;
    environment: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    port: number;
    environment: string;
}>;
