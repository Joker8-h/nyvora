import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@nyvora/database';

export interface ContactImportRow {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  position?: string;
  companyName?: string;
  type?: string;
}

export interface EmployeeImportRow {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  departmentName?: string;
  positionName?: string;
  salary?: number;
  hireDate?: string;
}

export interface CompanyImportRow {
  name: string;
  industry?: string;
  website?: string;
  taxId?: string;
  notes?: string;
}

export interface ImportResult {
  created: number;
  skipped: number;
  errors: { row: number; message: string }[];
}

@Injectable()
export class CrmImportService {
  private readonly logger = new Logger(CrmImportService.name);

  constructor(private readonly prisma: PrismaService) {}

  private parseDate(value: unknown): Date {
    if (!value) return new Date();
    if (value instanceof Date) return value;
    if (typeof value === 'number') {
      const excelEpoch = new Date(Date.UTC(1899, 11, 30));
      return new Date(excelEpoch.getTime() + value * 86400000);
    }
    const parsed = new Date(value as string);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  }

  private parseSalary(value: unknown): bigint | null {
    if (value === undefined || value === null || value === '') return null;
    const num = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]/g, ''));
    if (isNaN(num)) return null;
    return BigInt(Math.round(num));
  }

  private clean(value: unknown): string | undefined {
    if (value === undefined || value === null) return undefined;
    const str = String(value).trim();
    return str === '' ? undefined : str;
  }

  async importContacts(
    organizationId: string,
    userId: string,
    rows: ContactImportRow[],
  ): Promise<ImportResult> {
    const result: ImportResult = { created: 0, skipped: 0, errors: [] };
    const seen = new Set<string>();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const firstName = this.clean(row.firstName);
        if (!firstName) throw new Error('El nombre es requerido');
        const email = this.clean(row.email)?.toLowerCase();

        if (email) {
          if (seen.has(email) || (await this.prisma.crmContact.findFirst({
            where: { organizationId, email },
          }))) {
            result.skipped++;
            continue;
          }
          seen.add(email);
        }

        let companyId: string | undefined;
        const companyName = this.clean(row.companyName);
        if (companyName) {
          const existing = await this.prisma.crmCompany.findFirst({
            where: { organizationId, name: companyName },
          });
          companyId = existing?.id ?? (await this.prisma.crmCompany.create({
            data: { organizationId, name: companyName },
          })).id;
        }

        await this.prisma.crmContact.create({
          data: {
            organizationId,
            companyId,
            firstName,
            lastName: this.clean(row.lastName) ?? null,
            email: email ?? null,
            phone: this.clean(row.phone) ?? null,
            position: this.clean(row.position) ?? null,
            type: this.clean(row.type) ?? 'lead',
            createdById: userId,
          },
        });
        result.created++;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        result.errors.push({ row: i + 1, message });
      }
    }

    return result;
  }

  async importEmployees(
    organizationId: string,
    rows: EmployeeImportRow[],
  ): Promise<ImportResult> {
    const result: ImportResult = { created: 0, skipped: 0, errors: [] };
    const seen = new Set<string>();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const firstName = this.clean(row.firstName);
        const lastName = this.clean(row.lastName);
        const email = this.clean(row.email)?.toLowerCase();
        if (!firstName || !lastName || !email) {
          throw new Error('Nombre, apellido y email son requeridos');
        }

        if (seen.has(email) || (await this.prisma.employee.findFirst({
          where: { organizationId, email },
        }))) {
          result.skipped++;
          continue;
        }
        seen.add(email);

        let departmentId: string | undefined;
        const departmentName = this.clean(row.departmentName);
        if (departmentName) {
          const existing = await this.prisma.department.findFirst({
            where: { organizationId, name: departmentName },
          });
          departmentId = existing?.id ?? (await this.prisma.department.create({
            data: { organizationId, name: departmentName },
          })).id;
        }

        let positionId: string | undefined;
        const positionName = this.clean(row.positionName);
        if (positionName) {
          const existing = await this.prisma.position.findFirst({
            where: { organizationId, name: positionName },
          });
          positionId = existing?.id ?? (await this.prisma.position.create({
            data: { organizationId, name: positionName, departmentId },
          })).id;
        }

        await this.prisma.employee.create({
          data: {
            organizationId,
            departmentId,
            positionId,
            firstName,
            lastName,
            email,
            phone: this.clean(row.phone) ?? null,
            salary: this.parseSalary(row.salary),
            hireDate: this.parseDate(row.hireDate),
            contractType: 'permanent',
            status: 'active',
          },
        });
        result.created++;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        result.errors.push({ row: i + 1, message });
      }
    }

    return result;
  }

  async importCompanies(
    organizationId: string,
    userId: string,
    rows: CompanyImportRow[],
  ): Promise<ImportResult> {
    const result: ImportResult = { created: 0, skipped: 0, errors: [] };
    const seen = new Set<string>();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const name = this.clean(row.name);
        if (!name) throw new Error('El nombre de la empresa es requerido');

        if (seen.has(name) || (await this.prisma.crmCompany.findFirst({
          where: { organizationId, name },
        }))) {
          result.skipped++;
          continue;
        }
        seen.add(name);

        await this.prisma.crmCompany.create({
          data: {
            organizationId,
            name,
            industry: this.clean(row.industry) ?? null,
            website: this.clean(row.website) ?? null,
            taxId: this.clean(row.taxId) ?? null,
            notes: this.clean(row.notes) ?? null,
            createdById: userId,
          },
        });
        result.created++;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        result.errors.push({ row: i + 1, message });
      }
    }

    return result;
  }
}
