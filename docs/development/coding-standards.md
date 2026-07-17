# Coding Standards

This document outlines the coding standards for the Nexora project.

## TypeScript

### General Rules

```typescript
// Use strict mode
// tsconfig.json
{
  "compilerOptions": {
    "strict": true
  }
}

// Prefer interfaces over types for object shapes
interface User {
  id: string;
  email: string;
  firstName: string;
}

// Use type for unions and intersections
type UserStatus = 'active' | 'inactive' | 'suspended';
type UserWithRoles = User & { roles: Role[] };

// Use const by default, let when necessary
const MAX_RETRIES = 3;
let retryCount = 0;

// Avoid any - use unknown and type assertions
function processData(data: unknown) {
  if (typeof data === 'string') {
    return data.toUpperCase();
  }
  throw new Error('Invalid data');
}
```

### Naming Conventions

```typescript
// Variables and functions: camelCase
const userName = 'John';
function getUser() {}

// Classes: PascalCase
class UserService {}

// Interfaces: PascalCase, no 'I' prefix
interface User {}
interface CreateUserInput {}

// Types: PascalCase
type UserStatus = 'active' | 'inactive';

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.Nexora.com';
const MAX_LOGIN_ATTEMPTS = 5;

// Private members: underscore prefix (optional)
class UserService {
  private _cache = new Map();
}
```

### Functions

```typescript
// Prefer arrow functions for callbacks
const users = data.map((item) => item.user);

// Use descriptive function names
function createUserWithEmailAndPassword() {}
function validateEmailFormat() {}

// Keep functions small and focused
function validateUser(input: CreateUserInput) {
  validateEmail(input.email);
  validatePassword(input.password);
  validateName(input.firstName, input.lastName);
}

// Use early returns
function processUser(user: User | null) {
  if (!user) {
    return null;
  }

  if (user.status !== 'active') {
    return null;
  }

  return transformUser(user);
}
```

### Error Handling

```typescript
// Use custom error classes
class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Handle errors explicitly
async function fetchUser(id: string): Promise<User> {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new Error(`Invalid user data: ${error.message}`);
    }
    throw new Error('Failed to fetch user');
  }
}
```

## React

### Component Structure

```tsx
// Use functional components with hooks
interface UserCardProps {
  user: User;
  onSelect: (user: User) => void;
}

export function UserCard({ user, onSelect }: UserCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {
    onSelect(user);
  }, [user, onSelect]);

  return (
    <div onClick={handleClick}>
      <h3>{user.firstName} {user.lastName}</h3>
      <p>{user.email}</p>
    </div>
  );
}
```

### Hooks Rules

```tsx
// Always use hooks at the top level
function UserProfile({ userId }: { userId: string }) {
  // ✅ Correct
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  // ❌ Wrong - conditional hook
  if (isLoading) {
    return <Spinner />;
  }

  return <div>{user?.name}</div>;
}

// ✅ Correct - early return after hooks
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  if (isLoading) {
    return <Spinner />;
  }

  return <div>{user?.name}</div>;
}
```

### State Management

```tsx
// Use React Query for server state
function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
  });
}

// Use Zustand for client state (if needed)
const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

## NestJS

### Module Structure

```typescript
// Keep modules focused
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

### Service Structure

```typescript
// Use dependency injection
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cacheService: CacheService,
  ) {}

  async findById(id: string): Promise<User> {
    const cached = await this.cacheService.get(`user:${id}`);
    if (cached) {
      return cached;
    }

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.cacheService.set(`user:${id}`, user, 3600);
    return user;
  }
}
```

### Controller Structure

```typescript
// Use DTOs for validation
@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  async create(@Body() create_user_dto: CreateUserDto): Promise<User> {
    return this.usersService.create(create_user_dto);
  }
}
```

## Git

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add user registration
fix: resolve login timeout
docs: update API documentation
style: format code with prettier
refactor: extract user validation
perf: optimize database queries
test: add unit tests for auth
chore: update dependencies
```

### Branch Naming

```
feat/user-registration
fix/login-timeout
docs/api-documentation
refactor/user-validation
```

### Pull Requests

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## Code Review

### Checklist

- [ ] Code follows style guidelines
- [ ] No `any` types
- [ ] Error handling is proper
- [ ] Tests are included
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance is acceptable

### Comments

```typescript
// ✅ Good - explains WHY
// We use a 5-minute timeout because the API has a 4-minute limit
const TIMEOUT = 5 * 60 * 1000;

// ❌ Bad - explains WHAT (code already shows this)
// Increment counter by 1
counter++;

// ✅ Good - TODO with context
// TODO: Implement caching when Redis is available (see ADR-004)
async function getPopularProducts() {
  return this.productRepository.find({ order: { sales: 'DESC' } });
}
```

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [React Documentation](https://react.dev/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)