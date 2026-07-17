import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@nyvora/database';

const APP_CATALOG = [
  { id: 'whatsapp', name: 'WhatsApp Business', description: 'Envia y recibe mensajes de WhatsApp directamente desde Nyvora.', icon: '💬', category: 'Mensajeria', pricing: 'free' },
  { id: 'stripe', name: 'Stripe', description: 'Acepta pagos en linea con Stripe. Facturacion y cobros automaticos.', icon: '💳', category: 'Pagos', pricing: 'premium' },
  { id: 'sendgrid', name: 'SendGrid', description: 'Envia emails transaccionales y campañas de marketing por email.', icon: '✉️', category: 'Email', pricing: 'premium' },
  { id: 'slack', name: 'Slack', description: 'Recibe notificaciones de Nyvora en tus canales de Slack.', icon: '🔔', category: 'Notificaciones', pricing: 'free' },
  { id: 'hubspot', name: 'HubSpot CRM', description: 'Sincroniza contactos y deals entre Nyvora y HubSpot.', icon: '🧲', category: 'CRM', pricing: 'premium' },
  { id: 'trello', name: 'Trello', description: 'Crea tarjetas en Trello automaticamente desde tareas de Nyvora.', icon: '📋', category: 'Productividad', pricing: 'free' },
  { id: 'google-sheets', name: 'Google Sheets', description: 'Exporta datos de Nyvora a Google Sheets en tiempo real.', icon: '📊', category: 'Datos', pricing: 'free' },
  { id: 'zapier', name: 'Zapier', description: 'Conecta Nyvora con miles de aplicaciones sin codigo.', icon: '⚡', category: 'Automatizacion', pricing: 'premium' },
  { id: 'dropbox', name: 'Dropbox', description: 'Almacena y sincroniza archivos adjuntos en Dropbox.', icon: '📁', category: 'Almacenamiento', pricing: 'free' },
  { id: 'twilio', name: 'Twilio', description: 'Envia SMS y llamadas automaticas desde Nyvora.', icon: '📱', category: 'Mensajeria', pricing: 'premium' },
  { id: 'jira', name: 'Jira', description: 'Crea y gestiona issues de Jira desde tareas y proyectos de Nyvora.', icon: '🐛', category: 'Gestion', pricing: 'premium' },
  { id: 'google-calendar', name: 'Google Calendar', description: 'Sincroniza eventos y reuniones de Nyvora con Google Calendar.', icon: '📅', category: 'Calendario', pricing: 'free' },
];

@Injectable()
export class MarketplaceService {
  constructor(private readonly prisma: PrismaService) {}

  async findCatalog(organizationId: string) {
    const installations = await this.prisma.appInstallation.findMany({
      where: { organizationId, isActive: true },
      select: { appId: true, id: true, config: true },
    });
    const installMap = new Map(installations.map((i) => [i.appId, i]));
    return APP_CATALOG.map((app) => {
      const install = installMap.get(app.id);
      return {
        ...app,
        installed: !!install,
        installationId: install?.id || null,
        config: install?.config || {},
      };
    });
  }

  async findInstalledApps(organizationId: string) {
    return this.prisma.appInstallation.findMany({
      where: { organizationId, isActive: true },
      orderBy: { installedAt: 'desc' },
    });
  }

  async findInstallationById(id: string) {
    const installation = await this.prisma.appInstallation.findUnique({ where: { id } });
    if (!installation) throw new NotFoundException('Instalacion no encontrada');
    return installation;
  }

  async installApp(organizationId: string, appId: string, config?: Record<string, any>) {
    const existing = await this.prisma.appInstallation.findUnique({
      where: { appId_organizationId: { appId, organizationId } },
    });
    if (existing) throw new ConflictException('La app ya esta instalada');
    return this.prisma.appInstallation.create({
      data: { appId, organizationId, config: config || {} },
    });
  }

  async uninstallApp(id: string) {
    await this.findInstallationById(id);
    return this.prisma.appInstallation.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async updateAppConfig(id: string, config: Record<string, any>) {
    await this.findInstallationById(id);
    return this.prisma.appInstallation.update({
      where: { id },
      data: { config },
    });
  }
}
