import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CrmService } from './crm.service';
import { PrismaService } from '@nyvora/database';

describe('CrmService', () => {
  let service: CrmService;
  let prisma: Record<string, any>;

  const mockOrgId = 'org-123';

  beforeEach(async () => {
    prisma = {
      $transaction: jest.fn((promises) => Promise.all(promises)),
      crmContact: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        count: jest.fn().mockResolvedValue(1),
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'c-1', ...data })),
        update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
      },
      crmCompany: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        count: jest.fn().mockResolvedValue(1),
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'comp-1', ...data })),
        update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
      },
      crmLead: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        count: jest.fn().mockResolvedValue(1),
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'lead-1', ...data })),
        update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
      },
      crmPipeline: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        findFirst: jest.fn().mockResolvedValue({ id: 'p-1', name: 'Default Pipeline' }),
        count: jest.fn().mockResolvedValue(1),
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'pipe-1', ...data })),
        update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
        delete: jest.fn().mockImplementation(({ where }) => Promise.resolve({ id: where.id })),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrmService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CrmService>(CrmService);
  });

  // CONTACTS
  describe('Contacts', () => {
    it('should find contacts by org', async () => {
      prisma.crmContact.findMany.mockResolvedValue([{ id: 'c-1', firstName: 'John' }]);
      const result = await service.findContacts(mockOrgId);
      expect(result.data).toHaveLength(1);
      expect(prisma.crmContact.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ organizationId: mockOrgId }) }),
      );
    });

    it('should find contact by id', async () => {
      prisma.crmContact.findUnique.mockResolvedValue({ id: 'c-1', firstName: 'John' });
      const result = await service.findContactById('c-1');
      expect(result.id).toBe('c-1');
    });

    it('should throw NotFoundException for missing contact', async () => {
      prisma.crmContact.findUnique.mockResolvedValue(null);
      await expect(service.findContactById('missing')).rejects.toThrow(NotFoundException);
    });

    it('should create contact', async () => {
      const data = { organizationId: mockOrgId, firstName: 'Jane' };
      const result = await service.createContact(data);
      expect(result.firstName).toBe('Jane');
      expect(prisma.crmContact.create).toHaveBeenCalled();
    });

    it('should update contact', async () => {
      prisma.crmContact.findUnique.mockResolvedValue({ id: 'c-1' });
      const result = await service.updateContact('c-1', { firstName: 'Updated' });
      expect(result.firstName).toBe('Updated');
    });

    it('should soft-delete contact', async () => {
      prisma.crmContact.findUnique.mockResolvedValue({ id: 'c-1' });
      await service.deleteContact('c-1');
      expect(prisma.crmContact.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ deletedAt: expect.any(Date) }) }),
      );
    });
  });

  // COMPANIES
  describe('Companies', () => {
    it('should find companies by org', async () => {
      prisma.crmCompany.findMany.mockResolvedValue([{ id: 'comp-1', name: 'Acme' }]);
      const result = await service.findCompanies(mockOrgId);
      expect(result.data).toHaveLength(1);
    });

    it('should find company by id', async () => {
      prisma.crmCompany.findUnique.mockResolvedValue({ id: 'comp-1', name: 'Acme' });
      const result = await service.findCompanyById('comp-1');
      expect(result.name).toBe('Acme');
    });

    it('should throw NotFoundException for missing company', async () => {
      prisma.crmCompany.findUnique.mockResolvedValue(null);
      await expect(service.findCompanyById('missing')).rejects.toThrow(NotFoundException);
    });

    it('should create company', async () => {
      const result = await service.createCompany({ organizationId: mockOrgId, name: 'Acme' });
      expect(result.name).toBe('Acme');
    });

    it('should soft-delete company', async () => {
      prisma.crmCompany.findUnique.mockResolvedValue({ id: 'comp-1' });
      await service.deleteCompany('comp-1');
      expect(prisma.crmCompany.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ deletedAt: expect.any(Date) }) }),
      );
    });
  });

  // LEADS
  describe('Leads', () => {
    it('should find leads by org', async () => {
      prisma.crmLead.findMany.mockResolvedValue([{ id: 'lead-1' }]);
      const result = await service.findLeads(mockOrgId);
      expect(result.data).toHaveLength(1);
    });

    it('should find lead by id', async () => {
      prisma.crmLead.findUnique.mockResolvedValue({ id: 'lead-1' });
      const result = await service.findLeadById('lead-1');
      expect(result.id).toBe('lead-1');
    });

    it('should throw NotFoundException for missing lead', async () => {
      prisma.crmLead.findUnique.mockResolvedValue(null);
      await expect(service.findLeadById('missing')).rejects.toThrow(NotFoundException);
    });

    it('should create lead', async () => {
      const data = { organizationId: mockOrgId, pipelineId: 'p-1', stage: 'prospect' };
      const result = await service.createLead(data);
      expect(result.stage).toBe('prospect');
    });

    it('should soft-delete lead', async () => {
      prisma.crmLead.findUnique.mockResolvedValue({ id: 'lead-1' });
      await service.deleteLead('lead-1');
      expect(prisma.crmLead.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ deletedAt: expect.any(Date) }) }),
      );
    });
  });

  // PIPELINES
  describe('Pipelines', () => {
    it('should find pipelines by org', async () => {
      prisma.crmPipeline.findMany.mockResolvedValue([{ id: 'pipe-1', name: 'Sales' }]);
      const result = await service.findPipelines(mockOrgId);
      expect(result.data).toHaveLength(1);
    });

    it('should find pipeline by id', async () => {
      prisma.crmPipeline.findUnique.mockResolvedValue({ id: 'pipe-1' });
      const result = await service.findPipelineById('pipe-1');
      expect(result.id).toBe('pipe-1');
    });

    it('should throw NotFoundException for missing pipeline', async () => {
      prisma.crmPipeline.findUnique.mockResolvedValue(null);
      await expect(service.findPipelineById('missing')).rejects.toThrow(NotFoundException);
    });

    it('should create pipeline', async () => {
      const result = await service.createPipeline({ organizationId: mockOrgId, name: 'Sales Pipeline' });
      expect(result.name).toBe('Sales Pipeline');
    });

    it('should soft-delete pipeline', async () => {
      prisma.crmPipeline.findUnique.mockResolvedValue({ id: 'pipe-1' });
      await service.deletePipeline('pipe-1');
      expect(prisma.crmPipeline.update).toHaveBeenCalledWith({ where: { id: 'pipe-1' }, data: { deletedAt: expect.any(Date) } });
    });
  });
});
