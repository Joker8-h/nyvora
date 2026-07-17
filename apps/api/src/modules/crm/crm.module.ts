import { Module } from '@nestjs/common';
import { CrmService } from './crm.service';
import { CrmController } from './crm.controller';
import { CrmImportService } from './crm-import.service';
import { CrmImportController } from './crm-import.controller';

@Module({
  controllers: [CrmController, CrmImportController],
  providers: [CrmService, CrmImportService],
  exports: [CrmService],
})
export class CrmModule {}
