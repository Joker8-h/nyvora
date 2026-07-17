import { Injectable } from '@nestjs/common';
import { ToolRegistryService } from './tool-registry.service';

@Injectable()
export class ToolSelectorService {
  constructor(private readonly toolRegistry: ToolRegistryService) {}

  async select(reasoning: any, context: any): Promise<any[]> {
    if (reasoning.selectedTools && reasoning.selectedTools.length > 0) {
      return reasoning.selectedTools.filter((tool: any) => {
        const definition = this.toolRegistry.getTool(tool.name);
        return definition !== undefined;
      });
    }
    return [];
  }
}
