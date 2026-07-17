import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { PrismaService } from '@nyvora/database';

describe('MarketplaceService', () => {
  let service: MarketplaceService;
  let prisma: Record<string, any>;

  const mockOrgId = 'org-123';

  beforeEach(async () => {
    prisma = {
      appInstallation: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'inst-1', ...data, isActive: true, installedAt: new Date() })),
        update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketplaceService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<MarketplaceService>(MarketplaceService);
  });

  it('should find installed apps', async () => {
    const result = await service.findInstalledApps(mockOrgId);
    expect(result).toEqual([]);
    expect(prisma.appInstallation.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ organizationId: mockOrgId, isActive: true }) }),
    );
  });

  it('should find installation by id', async () => {
    prisma.appInstallation.findUnique.mockResolvedValue({ id: 'inst-1', appId: 'slack' });
    const result = await service.findInstallationById('inst-1');
    expect(result.appId).toBe('slack');
  });

  it('should throw for missing installation', async () => {
    await expect(service.findInstallationById('missing')).rejects.toThrow(NotFoundException);
  });

  it('should install app', async () => {
    prisma.appInstallation.findUnique.mockResolvedValue(null);
    const result = await service.installApp(mockOrgId, 'whatsapp', { apiKey: 'xxx' });
    expect(result.appId).toBe('whatsapp');
    expect(prisma.appInstallation.create).toHaveBeenCalled();
  });

  it('should reject duplicate installation', async () => {
    prisma.appInstallation.findUnique.mockResolvedValue({ id: 'existing', appId: 'slack' });
    await expect(service.installApp(mockOrgId, 'slack')).rejects.toThrow(ConflictException);
  });

  it('should uninstall app (soft-disable)', async () => {
    prisma.appInstallation.findUnique.mockResolvedValue({ id: 'inst-1' });
    await service.uninstallApp('inst-1');
    expect(prisma.appInstallation.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { isActive: false } }),
    );
  });

  it('should update app config', async () => {
    prisma.appInstallation.findUnique.mockResolvedValue({ id: 'inst-1' });
    const newConfig = { webhook: 'https://example.com' };
    await service.updateAppConfig('inst-1', newConfig);
    expect(prisma.appInstallation.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { config: newConfig } }),
    );
  });
});
