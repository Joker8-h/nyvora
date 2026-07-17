# ADR-006: Dark-first Design System

## Status

Accepted

## Context

Nexora needs a consistent, modern design system that:
- Works across web, mobile, and desktop
- Supports dark and light modes
- Is accessible (WCAG 2.1 AA)
- Is performant (no layout shifts)
- Is maintainable (design tokens)

## Decision

We will implement a **dark-first design system** using:

### Design Tokens

```css
/* Dark mode (default) */
:root {
  --background: 224 71% 4%;
  --foreground: 210 20% 98%;
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 1.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 20% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 20% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 20% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
  --radius: 0.5rem;
}

/* Light mode */
.light {
  --background: 0 0% 100%;
  --foreground: 224 71% 4%;
  --primary: 220.9 39.3% 11%;
  --primary-foreground: 210 20% 98%;
  --secondary: 220 14.3% 95.9%;
  --secondary-foreground: 220.9 39.3% 11%;
  --muted: 220 14.3% 95.9%;
  --muted-foreground: 220 8.9% 46.1%;
  --accent: 220 14.3% 95.9%;
  --accent-foreground: 220.9 39.3% 11%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 20% 98%;
  --border: 220 13% 91%;
  --input: 220 13% 91%;
  --ring: 224 71% 4%;
}
```

### Component Library

Using shadcn/ui as the foundation:

```tsx
// Button component
const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
```

### Typography

```css
:root {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
}
```

### Spacing

```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
}
```

## Consequences

### Positive
- **Consistent**: All components use the same tokens
- **Accessible**: WCAG 2.1 AA compliant
- **Themeable**: Easy to create new themes
- **Performant**: No runtime theme switching
- **Maintainable**: Single source of truth

### Negative
- **Learning Curve**: Team needs to learn the system
- **Customization**: Limited customization per client
- **Bundle Size**: Full component library increases bundle size
- **Migration**: Existing components need to be rewritten

### Mitigations
- **Documentation**: Comprehensive Storybook docs
- **Composition**: Build complex components from simple ones
- **Tree Shaking**: Only import used components
- **Codemods**: Automated migration scripts

## Alternatives Considered

### 1. Material UI
- **Pros**: Google-backed, comprehensive
- **Cons**: Opinionated, heavy, not dark-first
- **Verdict**: Too opinionated for our needs

### 2. Chakra UI
- **Pros**: Good DX, themeable
- **Cons**: Performance issues, large bundle
- **Verdict**: Performance concerns

### 3. Custom CSS-in-JS
- **Pros**: Maximum flexibility
- **Cons**: Runtime overhead, harder to maintain
- **Verdict**: Too much maintenance burden

## References

- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)