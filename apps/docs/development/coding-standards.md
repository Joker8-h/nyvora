# Estándares de Código

## TypeScript

### Configuración
- Strict mode habilitado
- `noUncheckedIndexedAccess: true`
- `noImplicitReturns: true`

### Convenciones
```typescript
// ✅ Correcto
interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
}

class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({ data: dto });
  }
}

// ❌ Incorrecto
function createUser(dto) {  // Sin tipos
  return prisma.user.create({ data: dto });  // Sin inyección
}
```

## React (Next.js)

### Componentes
```typescript
// ✅ Correcto - Componente con props tipadas
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant = 'primary', children, onClick }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}

// ❌ Incorrecto
export function Button(props) {  // Sin tipos
  return <button>{props.children}</button>;
}
```

## NestJS

### Servicios
```typescript
// ✅ Correcto
@Injectable()
export class CustomerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBus,
  ) {}

  async create(dto: CreateCustomerDto): Promise<Customer> {
    const customer = await this.prisma.customer.create({ data: dto });
    this.eventBus.publish(new CustomerCreatedEvent(customer));
    return customer;
  }
}

// ❌ Incorrecto
@Injectable()
export class CustomerService {
  create(dto) {  // Sin tipos
    return prisma.customer.create({ data: dto });  // Sin inyección
  }
}
```

## Prisma

### Schema
```prisma
// ✅ Correcto
model Customer {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  status    CustomerStatus @default(ACTIVE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([email])
  @@index([status])
}

// ❌ Incorrecto
model Customer {
  id     String  // Sin @id
  email  String  // Sin @unique
  status String  // Sin enum
}
```

## CSS/Tailwind

### Clases
```tsx
// ✅ Correcto
<div className="flex items-center gap-4 p-6 bg-surface rounded-lg border border-border">
  <span className="text-sm text-muted-foreground">Hello</span>
</div>

// ❌ Incorrecto
<div style={{ display: 'flex', padding: '24px' }}>  // Inline styles
  <span style={{ color: 'gray' }}>Hello</span>
</div>
```

## Testing

### Unit Tests
```typescript
// ✅ Correcto
describe('CustomerService', () => {
  let service: CustomerService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CustomerService, PrismaService],
    }).compile();

    service = module.get(CustomerService);
    prisma = module.get(PrismaService);
  });

  it('should create a customer', async () => {
    const dto = { email: 'test@example.com', name: 'Test' };
    const result = await service.create(dto);
    expect(result).toHaveProperty('id');
  });
});
```

## Naming Conventions

| Tipo | Convención | Ejemplo |
|------|------------|---------|
| Archivos | kebab-case | `customer.service.ts` |
| Clases | PascalCase | `CustomerService` |
| Variables | camelCase | `customerData` |
| Constantes | UPPER_SNAKE | `MAX_RETRY_COUNT` |
| Enums | PascalCase | `CustomerStatus` |
| DTOs | PascalCase + Dto | `CreateCustomerDto` |
