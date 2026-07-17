import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { CampaignsService, CAMPAIGN_QUEUE } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';
import { CampaignsProcessor } from './campaigns.processor';
import { IntegrationsModule } from '../integrations/integrations.module';

@Module({
  imports: [
    IntegrationsModule,
    BullModule.registerQueue({ name: CAMPAIGN_QUEUE }),
  ],
  controllers: [CampaignsController],
  providers: [CampaignsService, CampaignsProcessor],
  exports: [CampaignsService],
})
export class CampaignsModule {}
