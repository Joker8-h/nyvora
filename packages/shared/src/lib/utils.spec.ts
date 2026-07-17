import { slugify, truncate, capitalize, camelToSnake, snakeToCamel, formatCurrency, formatDate, isValidEmail, isValidPassword, groupBy, chunk } from '../lib/utils';

describe('String Utilities', () => {
  describe('slugify', () => {
    it('should convert text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('should handle special characters', () => {
      expect(slugify('Hello! @World#')).toBe('hello-world');
    });

    it('should handle multiple spaces', () => {
      expect(slugify('Hello   World')).toBe('hello-world');
    });

    it('should trim leading/trailing dashes', () => {
      expect(slugify('--Hello--')).toBe('hello');
    });
  });

  describe('truncate', () => {
    it('should truncate long text', () => {
      expect(truncate('Hello World', 8)).toBe('Hello...');
    });

    it('should not truncate short text', () => {
      expect(truncate('Hi', 10)).toBe('Hi');
    });

    it('should handle exact length', () => {
      expect(truncate('Hello', 5)).toBe('Hello');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should lowercase rest', () => {
      expect(capitalize('hELLO')).toBe('Hello');
    });
  });

  describe('camelToSnake', () => {
    it('should convert camelCase to snake_case', () => {
      expect(camelToSnake('helloWorld')).toBe('hello_world');
    });

    it('should handle multiple capitals', () => {
      expect(camelToSnake('helloWorldTest')).toBe('hello_world_test');
    });
  });

  describe('snakeToCamel', () => {
    it('should convert snake_case to camelCase', () => {
      expect(snakeToCamel('hello_world')).toBe('helloWorld');
    });

    it('should handle multiple underscores', () => {
      expect(snakeToCamel('hello_world_test')).toBe('helloWorldTest');
    });
  });
});

describe('Number Utilities', () => {
  describe('formatCurrency', () => {
    it('should format currency', () => {
      const result = formatCurrency(1000, 'USD', 'en-US');
      expect(result).toContain('1');
      expect(result).toContain('000');
    });
  });
});

describe('Date Utilities', () => {
  describe('formatDate', () => {
    it('should format date', () => {
      const result = formatDate(new Date('2024-01-15'));
      expect(result).toBeTruthy();
    });
  });
});

describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('should validate correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(isValidEmail('invalid')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('should validate strong password', () => {
      const result = isValidPassword('Password123!');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject weak password', () => {
      const result = isValidPassword('123');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});

describe('Array Utilities', () => {
  describe('groupBy', () => {
    it('should group items by key', () => {
      const items = [{ type: 'a', name: '1' }, { type: 'b', name: '2' }, { type: 'a', name: '3' }];
      const result = groupBy(items, 'type');
      expect(result.a).toHaveLength(2);
      expect(result.b).toHaveLength(1);
    });
  });

  describe('chunk', () => {
    it('should split array into chunks', () => {
      const result = chunk([1, 2, 3, 4, 5], 2);
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual([1, 2]);
      expect(result[2]).toEqual([5]);
    });
  });
});
