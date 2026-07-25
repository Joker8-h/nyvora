import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { HrService } from './hr.service';
import { PrismaService } from '@nyvora/database';

describe('HrService', () => {
  let service: HrService;
  let prisma: Record<string, any>;

  const mockOrgId = 'org-123';

  beforeEach(async () => {
    prisma = {
      $transaction: jest.fn((promises) => Promise.all(promises)),
      employee: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        count: jest.fn().mockResolvedValue(0),
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'emp-1', ...data })),
        update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
      },
      position: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        count: jest.fn().mockResolvedValue(0),
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'pos-1', ...data })),
        update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
        delete: jest.fn().mockImplementation(({ where }) => Promise.resolve({ id: where.id })),
      },
      absence: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        count: jest.fn().mockResolvedValue(0),
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'abs-1', ...data })),
        update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
        delete: jest.fn().mockImplementation(({ where }) => Promise.resolve({ id: where.id })),
      },
      evaluation: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        count: jest.fn().mockResolvedValue(0),
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'eval-1', ...data })),
        update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
        delete: jest.fn().mockImplementation(({ where }) => Promise.resolve({ id: where.id })),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HrService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<HrService>(HrService);
  });

  // EMPLOYEES
  describe('Employees', () => {
    it('should find employees', async () => {
      const result = await service.findEmployees(mockOrgId);
      expect(result).toEqual({ data: [], total: 0, page: 1, limit: 20 });
    });

    it('should find employee by id', async () => {
      prisma.employee.findUnique.mockResolvedValue({ id: 'emp-1', firstName: 'John' });
      const result = await service.findEmployeeById('emp-1');
      expect(result.firstName).toBe('John');
    });

    it('should throw for missing employee', async () => {
      await expect(service.findEmployeeById('missing')).rejects.toThrow(NotFoundException);
    });

    it('should create employee', async () => {
      const result = await service.createEmployee({
        organizationId: mockOrgId,
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        hireDate: new Date(),
      });
      expect(result.firstName).toBe('Jane');
    });

    it('should soft-delete employee', async () => {
      prisma.employee.findUnique.mockResolvedValue({ id: 'emp-1' });
      await service.deleteEmployee('emp-1');
      expect(prisma.employee.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ deletedAt: expect.any(Date) }) }),
      );
    });
  });

  // POSITIONS
  describe('Positions', () => {
    it('should find positions', async () => {
      const result = await service.findPositions(mockOrgId);
      expect(result).toEqual({ data: [], total: 0 });
    });

    it('should find position by id', async () => {
      prisma.position.findUnique.mockResolvedValue({ id: 'pos-1', name: 'Developer' });
      const result = await service.findPositionById('pos-1');
      expect(result.name).toBe('Developer');
    });

    it('should throw for missing position', async () => {
      await expect(service.findPositionById('missing')).rejects.toThrow(NotFoundException);
    });

    it('should create position', async () => {
      const result = await service.createPosition({ organizationId: mockOrgId, name: 'Designer' });
      expect(result.name).toBe('Designer');
    });

    it('should hard-delete position', async () => {
      prisma.position.findUnique.mockResolvedValue({ id: 'pos-1' });
      await service.deletePosition('pos-1');
      expect(prisma.position.delete).toHaveBeenCalledWith({ where: { id: 'pos-1' } });
    });
  });

  // ABSENCES
  describe('Absences', () => {
    it('should find absences', async () => {
      const result = await service.findAbsences(mockOrgId);
      expect(result).toEqual({ data: [], total: 0, page: 1, limit: 20 });
    });

    it('should find absence by id', async () => {
      prisma.absence.findUnique.mockResolvedValue({ id: 'abs-1', type: 'vacation' });
      const result = await service.findAbsenceById('abs-1');
      expect(result.type).toBe('vacation');
    });

    it('should throw for missing absence', async () => {
      await expect(service.findAbsenceById('missing')).rejects.toThrow(NotFoundException);
    });

    it('should create absence', async () => {
      const result = await service.createAbsence({
        employeeId: 'emp-1',
        type: 'sick',
        startDate: new Date('2026-07-01'),
        endDate: new Date('2026-07-03'),
      });
      expect(result.type).toBe('sick');
    });

    it('should hard-delete absence', async () => {
      prisma.absence.findUnique.mockResolvedValue({ id: 'abs-1' });
      await service.deleteAbsence('abs-1');
      expect(prisma.absence.delete).toHaveBeenCalledWith({ where: { id: 'abs-1' } });
    });
  });

  // EVALUATIONS
  describe('Evaluations', () => {
    it('should find evaluations', async () => {
      const result = await service.findEvaluations(mockOrgId);
      expect(result).toEqual({ data: [], total: 0, page: 1, limit: 20 });
    });

    it('should find evaluation by id', async () => {
      prisma.evaluation.findUnique.mockResolvedValue({ id: 'eval-1', period: 'Q1 2026' });
      const result = await service.findEvaluationById('eval-1');
      expect(result.period).toBe('Q1 2026');
    });

    it('should throw for missing evaluation', async () => {
      await expect(service.findEvaluationById('missing')).rejects.toThrow(NotFoundException);
    });

    it('should create evaluation', async () => {
      const result = await service.createEvaluation({
        employeeId: 'emp-1',
        period: 'Q2 2026',
        selfScore: 8,
        managerScore: 7,
      });
      expect(result.period).toBe('Q2 2026');
    });

    it('should hard-delete evaluation', async () => {
      prisma.evaluation.findUnique.mockResolvedValue({ id: 'eval-1' });
      await service.deleteEvaluation('eval-1');
      expect(prisma.evaluation.delete).toHaveBeenCalledWith({ where: { id: 'eval-1' } });
    });
  });
});
