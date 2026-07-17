import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema } from '../lib/validators';

describe('Auth Validators', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const result = loginSchema.safeParse({ email: 'test@example.com', password: 'password123' });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = loginSchema.safeParse({ email: 'invalid', password: 'password123' });
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const result = loginSchema.safeParse({ email: 'test@example.com', password: '123' });
      expect(result.success).toBe(false);
    });

    it('should accept rememberMe optional', () => {
      const result = loginSchema.safeParse({ email: 'test@example.com', password: 'password123', rememberMe: true });
      expect(result.success).toBe(true);
    });
  });

  describe('registerSchema', () => {
    it('should validate correct register data', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });
      expect(result.success).toBe(true);
    });

    it('should reject mismatched passwords', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'different',
        firstName: 'John',
        lastName: 'Doe',
      });
      expect(result.success).toBe(false);
    });

    it('should accept optional companyName', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        companyName: 'Acme Corp',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('forgotPasswordSchema', () => {
    it('should validate email', () => {
      const result = forgotPasswordSchema.safeParse({ email: 'test@example.com' });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = forgotPasswordSchema.safeParse({ email: 'not-an-email' });
      expect(result.success).toBe(false);
    });
  });

  describe('resetPasswordSchema', () => {
    it('should validate correct reset data', () => {
      const result = resetPasswordSchema.safeParse({
        token: 'abc123',
        password: 'newpassword',
        confirmPassword: 'newpassword',
      });
      expect(result.success).toBe(true);
    });

    it('should reject mismatched passwords', () => {
      const result = resetPasswordSchema.safeParse({
        token: 'abc123',
        password: 'newpassword',
        confirmPassword: 'different',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('changePasswordSchema', () => {
    it('should validate correct change password data', () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: 'oldpassword',
        newPassword: 'newpassword',
        confirmPassword: 'newpassword',
      });
      expect(result.success).toBe(true);
    });

    it('should reject mismatched new passwords', () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: 'oldpassword',
        newPassword: 'newpassword',
        confirmPassword: 'different',
      });
      expect(result.success).toBe(false);
    });
  });
});
