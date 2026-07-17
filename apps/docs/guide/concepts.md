# Conceptos Clave

## Jerarquía Multi-Tenant

```
Tenant (Empresa)
  └── Workspace (Área de trabajo)
        └── Organization (Organización)
              └── Branch (Sucursal)
                    └── Department (Departamento)
                          └── User (Usuario)
```

## RBAC + ABAC

Nexora implementa un sistema híbrido de control de acceso:

- **RBAC (Role-Based Access Control)**: Permisos asignados a roles
- **ABAC (Attribute-Based Access Control)**: Condiciones basadas en atributos

### Ejemplo
```typescript
// RBAC: El usuario tiene el rol "sales_manager"
// ABAC: Puede facturas menores a $5,000,000 COP
{
  "resource": "invoices",
  "action": "create",
  "conditions": {
    "amount": { "lt": 5000000 },
    "branchId": { "eq": "user.branchId" }
  }
}
```

## Event-Driven Architecture

Los módulos se comunican mediante eventos:

```typescript
// Publicar evento
eventBus.publish(new InvoiceCreated(invoice));

// Suscribirse
eventBus.subscribe('InvoiceCreated', async (event) => {
  await updateInventory(event.items);
  await notifyCustomer(event.customerId);
});
```

## Nova - AI Pipeline

```
User Input → Planner → Reasoner → Tool Selector → Executor → Memory → Response
```

1. **Planner**: Analiza la intención del usuario
2. **Reasoner**: Decide qué herramientas usar
3. **Tool Selector**: Selecciona la herramienta correcta
4. **Executor**: Ejecuta la acción
5. **Memory**: Almacena el contexto
6. **Response**: Genera la respuesta
