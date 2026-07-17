# API de Nexora

## Visión General

La API de Nexora está construida con NestJS y expone endpoints RESTful con documentación Swagger automática.

## Base URL

```
Desarrollo: http://localhost:4000
Producción: https://api.Nexora.com
```

## Autenticación

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Response
```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJSUzI1NiIs...",
  "user": {
    "id": "usr_abc123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Using Tokens
```http
GET /api/customers
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
```

## Endpoints Principales

### Auth
| Method | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/login` | Iniciar sesión |
| POST | `/auth/register` | Registrar usuario |
| POST | `/auth/refresh` | Refrescar token |
| POST | `/auth/logout` | Cerrar sesión |

### CRM
| Method | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/crm/customers` | Listar clientes |
| POST | `/crm/customers` | Crear cliente |
| GET | `/crm/customers/:id` | Obtener cliente |
| PATCH | `/crm/customers/:id` | Actualizar cliente |
| DELETE | `/crm/customers/:id` | Eliminar cliente |

### Sales
| Method | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/sales/quotes` | Listar cotizaciones |
| POST | `/sales/quotes` | Crear cotización |
| GET | `/sales/invoices` | Listar facturas |
| POST | `/sales/invoices` | Crear factura |
| POST | `/sales/invoices/:id/pay` | Registrar pago |

### Inventory
| Method | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/inventory/products` | Listar productos |
| POST | `/inventory/products` | Crear producto |
| GET | `/inventory/warehouses` | Listar almacenes |
| POST | `/inventory/stock-adjustments` | Ajustar stock |

### AI (Nova)
| Method | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/ai/chat` | Chat con Nova (SSE) |
| GET | `/ai/tools` | Listar herramientas disponibles |

## Paginación

```http
GET /api/customers?page=1&limit=20&sortBy=createdAt&sortOrder=desc
```

### Response
```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

## Errores

```json
{
  "statusCode": 400,
  "message": ["Email must be an email"],
  "error": "Bad Request"
}
```

## Rate Limiting

- **Autenticado**: 1000 requests/minuto
- **No autenticado**: 100 requests/minuto

## Documentación Swagger

La documentación completa está disponible en:
```
http://localhost:4000/docs
```
