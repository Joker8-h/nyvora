import { Module } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { IntegrationsController } from './integrations.controller';
import { EncryptionService } from './encryption.service';
import { WhatsappWebService } from './whatsapp-web.service';

@Module({
  controllers: [IntegrationsController],
  providers: [IntegrationsService, EncryptionService, WhatsappWebService],
  exports: [IntegrationsService, EncryptionService, WhatsappWebService],
})
export class IntegrationsModule {}
