declare module 'next/navigation' {
  export function useRouter(): any;
  export function usePathname(): string;
  export function useSearchParams(): any;
  export function redirect(url: string): void;
  export function notFound(): void;
}

declare module 'next/link' {
  import React from 'react';
  const Link: React.FC<any>;
  export default Link;
}
