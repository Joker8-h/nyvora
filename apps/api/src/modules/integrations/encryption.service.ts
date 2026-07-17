import { Injectable, Logger } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly logger = new Logger(EncryptionService.name);
  private readonly key: Buffer;

  constructor() {
    const secret = process.env.ENCRYPTION_KEY || '';
    if (!secret) {
      this.logger.warn(
        'ENCRYPTION_KEY no configurada; usando clave derivada por defecto. Configura ENCRYPTION_KEY en produccion.',
      );
    }
    this.key = createHash('sha256')
      .update(secret || 'nyvora-insecure-default-key')
      .digest();
  }

  encrypt(plain: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.key, iv);
    const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `${iv.toString('base64')}:${tag.toString('base64')}:${enc.toString('base64')}`;
  }

  decrypt(payload: string): string {
    const [ivB64, tagB64, dataB64] = payload.split(':');
    if (!ivB64 || !tagB64 || !dataB64) {
      throw new Error('Formato de credencial cifrada invalido');
    }
    const iv = Buffer.from(ivB64, 'base64');
    const tag = Buffer.from(tagB64, 'base64');
    const data = Buffer.from(dataB64, 'base64');
    const decipher = createDecipheriv('aes-256-gcm', this.key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
  }

  encryptObject(obj: Record<string, any>): string {
    return this.encrypt(JSON.stringify(obj));
  }

  decryptObject<T = Record<string, any>>(payload: string): T {
    return JSON.parse(this.decrypt(payload)) as T;
  }

  mask(value: string): string {
    if (!value) return '';
    if (value.length <= 4) return '****';
    return `${'*'.repeat(Math.max(4, value.length - 4))}${value.slice(-4)}`;
  }
}
