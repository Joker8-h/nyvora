import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ToolRegistryService } from './tool-registry.service';

@Injectable()
export class ExecutorService {
  constructor(private readonly toolRegistry: ToolRegistryService) {}

  private hasPermission(userPermissions: string[], required: string): boolean {
    if (userPermissions.includes(required)) return true;
    const module = required.split(':')[0];
    return userPermissions.includes(`${module}:manage`);
  }

  async execute(tool: { name: string; arguments: Record<string, any> }, userId: string, context: { organizationId?: string; branchId?: string; permissions: string[] }): Promise<any> {
    const toolDefinition = this.toolRegistry.getTool(tool.name);

    if (!toolDefinition) {
      throw new NotFoundException(`Tool ${tool.name} not found`);
    }

    const required = toolDefinition.requiredPermissions ?? [];
    const userPermissions = context.permissions || [];
    if (required.length > 0) {
      const missing = required.filter((p) => !this.hasPermission(userPermissions, p));
      if (missing.length > 0) {
        throw new ForbiddenException(
          `No tienes permiso para ejecutar ${tool.name}. Faltan: ${missing.join(', ')}`,
        );
      }
    }

    try {
      const result = await toolDefinition.execute(tool.arguments, {
        userId,
        organizationId: context.organizationId,
        branchId: context.branchId,
        permissions: context.permissions || [],
      });

      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Error executing ${tool.name}: ${message}`);
    }
  }
}
