# Don Remolo API

<p align="right">
  <a href="http://nestjs.com/" target="blank"><img src="/src/images/Piizeria01.jpg" width="200" alt="Don Remolo Logo" /></a>
</p>

## 📋 Descripción

Este proyecto es una API desarrollada con [NestJS](https://nestjs.com/) para gestionar pedidos del restaurante Don Remolo. La API trabaja en conjunto con el frontend para proporcionar una experiencia completa de pedidos en línea.

## 🏗️ Arquitectura del Proyecto

### Backend (NestJS)

- **Framework**: NestJS v9.x
- **Base de Datos**: PostgreSQL
- **ORM**: TypeORM
- **Documentación API**: Swagger/OpenAPI
- **Autenticación**: JWT

### Módulos Principales

#### 🔹 Categories

- Gestión CRUD de categorías de productos
- Endpoints:
  - `GET /categories` - Listar categorías
  - `POST /categories` - Crear categoría
  - `PUT /categories/:id` - Actualizar categoría
  - `DELETE /categories/:id` - Eliminar categoría

#### 🔹 Products

- Gestión completa de productos
- Soporte para imágenes
- Filtrado por categorías
- Endpoints principales en `/products`

#### 🔹 Orders

- Sistema de gestión de pedidos
- Estados: Pendiente, Confirmado, En Preparación, Enviado, Entregado
- Integración con sistema de notificaciones

#### 🔹 WhatsApp

- Servicio de notificaciones vía WhatsApp
- Confirmaciones automáticas
- Actualizaciones de estado

## 📚 Endpoints para Frontend

🔹 Categorías
GET/categoriesListar todas las categoríasNoGET/categories/:idObtener categoría por IDNo

🔹 Productos
GET/productsListar productos?category=id&sort=priceNoGET/products/:idDetalle de producto-NoGET/products/featuredProductos destacados-No

🔹 Pedidos
@Post()
create(@Body() createOrderDto: CreateOrderDto): Promise<WhatsappResponse> {
return this.ordersService.create(createOrderDto);
}

## 🚀 Configuración del Entorno

### Prerrequisitos

- Node.js (v16 o superior)
- npm v8+
- PostgreSQL
- Redis (para caché)

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/donremolo
JWT_SECRET=your-secret-key
WHATSAPP_API_KEY=your-whatsapp-key
REDIS_URL=redis://localhost:6379

# Instalar dependencias
npm install

# Configurar base de datos
npm run typeorm:migration:run

# Generar datos de prueba (opcional)
npm run seed

# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod

📚 Documentación API
La documentación Swagger está disponible en http://localhost:3000/api-docs

Para generar la documentación técnica:

npm run docs

# Pruebas unitarias
npm run test

# Pruebas e2e
npm run test:e2e

# Cobertura
npm run test:cov
```

👥 Integración Frontend
Endpoints Principales para Frontend
Autenticación: /auth/login
Productos: /products
Categorías: /categories
Pedidos: /orders

## Ejemplos de Integración

// Ejemplo de llamada a la API
const response = await fetch('http://localhost:3000/products', {
headers: {
'Authorization': `Bearer ${token}`,
'Content-Type': 'application/json'
}
});

Manejo de Errores
La API utiliza códigos de estado HTTP estándar:

200: Éxito
400: Error de cliente
401: No autorizado
403: Prohibido
404: No encontrado
500: Error del servidor
🤝 Contribuciones
Fork el repositorio
Crea una rama: git checkout -b feature/nueva-funcionalidad
Commit tus cambios: git commit -am 'feat: añadir nueva funcionalidad'
Push a la rama: git push origin feature/nueva-funcionalidad
Crea un Pull Request
Convenciones de Código
Usar TypeScript strict mode
Seguir guía de estilo de NestJS
Documentar nuevos endpoints en Swagger
Incluir pruebas unitarias
📝 Licencia
Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## Manejo de Errores

La API utiliza códigos de estado HTTP estándar:

200: Éxito
400: Error de cliente
401: No autorizado
403: Prohibido
404: No encontrado
500: Error del servidor

🤝 Contribuciones
Fork el repositorio
Crea una rama: git checkout -b feature/nueva-funcionalidad
Commit tus cambios: git commit -am 'feat: añadir nueva funcionalidad'
Push a la rama: git push origin feature/nueva-funcionalidad
Crea un Pull Request
Convenciones de Código
Usar TypeScript strict mode
Seguir guía de estilo de NestJS
Documentar nuevos endpoints en Swagger
Incluir pruebas unitarias
📝 Licencia
Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

🆘 Soporte
Para reportar problemas o solicitar ayuda:

Crear un issue en GitHub
Contactar al equipo de desarrollo: agustina_1312@hotmail.com , diegoguamanmedina@gmail.com ó rudargeneira@gmail.com

👤 Frontend:
Rubén D. Guerrero N.

👤 Backend:

Rubén D. Guerrero N.
