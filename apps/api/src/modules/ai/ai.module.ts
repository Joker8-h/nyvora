import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiController } from './ai.controller';
import { NovaOrchestratorService } from './services/nova-orchestrator.service';
import { PlannerService } from './services/planner.service';
import { ReasonerService } from './services/reasoner.service';
import { ToolSelectorService } from './services/tool-selector.service';
import { ExecutorService } from './services/executor.service';
import { ContextBuilderService } from './services/context-builder.service';
import { MemoryService } from './services/memory.service';
import { ToolRegistryService } from './services/tool-registry.service';
import { OpenAIService } from './services/openai.service';
import { AuthModule } from '../auth/auth.module';
import { CampaignsModule } from '../campaigns/campaigns.module';

@Module({
  imports: [ConfigModule, AuthModule, CampaignsModule],
  controllers: [AiController],
  providers: [
    NovaOrchestratorService,
    PlannerService,
    ReasonerService,
    ToolSelectorService,
    ExecutorService,
    ContextBuilderService,
    MemoryService,
    ToolRegistryService,
    OpenAIService,
  ],
  exports: [NovaOrchestratorService, ToolRegistryService, OpenAIService],
})
export class AiModule {}