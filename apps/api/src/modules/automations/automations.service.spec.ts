import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AutomationsService } from './automations.service';
import { PrismaService } from '@nyvora/database';

describe('AutomationsService', () => {
  let service: AutomationsService;
  let prisma: Record<string, any>;

  const mockOrgId = 'org-123';

  beforeEach(async () => {
    prisma = {
      automation: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'auto-1', ...data, status: 'active', executionCount: 0 })),
        update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
        delete: jest.fn().mockImplementation(({ where }) => Promise.resolve({ id: where.id })),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutomationsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<AutomationsService>(AutomationsService);
  });

  it('should find automations', async () => {
    const result = await service.findAutomations(mockOrgId);
    expect(result).toEqual([]);
    expect(prisma.automation.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ organizationId: mockOrgId }) }),
    );
  });

  it('should find automation by id', async () => {
    prisma.automation.findUnique.mockResolvedValue({ id: 'auto-1', name: 'Lead Alert' });
    const result = await service.findAutomationById('auto-1');
    expect(result.name).toBe('Lead Alert');
  });

  it('should throw for missing automation', async () => {
    await expect(service.findAutomationById('missing')).rejects.toThrow(NotFoundException);
  });

  it('should create automation', async () => {
    const result = await service.createAutomation({
      organizationId: mockOrgId,
      name: 'New Lead Alert',
      triggerType: 'lead.created',
      triggerConfig: { type: 'lead.created' },
      actions: [{ type: 'email.send', config: {} }],
    });
    expect(result.name).toBe('New Lead Alert');
  });

  it('should toggle automation from active to paused', async () => {
    prisma.automation.findUnique.mockResolvedValue({ id: 'auto-1', status: 'active' });
    const result = await service.toggleAutomation('auto-1');
    expect(result.status).toBe('paused');
    expect(prisma.automation.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: 'paused' } }),
    );
  });

  it('should toggle automation from paused to active', async () => {
    prisma.automation.findUnique.mockResolvedValue({ id: 'auto-1', status: 'paused' });
    const result = await service.toggleAutomation('auto-1');
    expect(result.status).toBe('active');
    expect(prisma.automation.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: 'active' } }),
    );
  });

  it('should execute automation and increment count', async () => {
    prisma.automation.findUnique.mockResolvedValue({ id: 'auto-1', executionCount: 5 });
    const result = await service.executeAutomation('auto-1');
    expect(result.success).toBe(true);
    expect(result.automationId).toBe('auto-1');
    expect(prisma.automation.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          lastExecutedAt: expect.any(Date),
        }),
      }),
    );
  });

  it('should hard-delete automation', async () => {
    prisma.automation.findUnique.mockResolvedValue({ id: 'auto-1' });
    await service.deleteAutomation('auto-1');
    expect(prisma.automation.delete).toHaveBeenCalledWith({ where: { id: 'auto-1' } });
  });
});
