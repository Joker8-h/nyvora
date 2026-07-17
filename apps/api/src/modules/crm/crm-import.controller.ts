import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CrmImportService, ContactImportRow, EmployeeImportRow, CompanyImportRow } from './crm-import.service';
import type { AuthUser } from '@nyvora/types';

@ApiTags('CRM Import')
@ApiBearerAuth()
@Controller('crm/import')
@UseGuards(JwtAccessGuard, PermissionsGuard)
export class CrmImportController {
  constructor(private readonly importService: CrmImportService) {}

  @Post('contacts')
  @Permissions('crm:contacts:create')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Importar contactos desde Excel (filas ya mapeadas)' })
  async importContacts(
    @Body() body: { rows: ContactImportRow[] },
    @CurrentUser() user: AuthUser,
  ) {
    const organizationId = user.organizationId ?? '';
    return this.importService.importContacts(organizationId, user.id, body.rows || []);
  }

  @Post('employees')
  @Permissions('hr:employees:create')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Importar trabajadores a RRHH desde Excel (filas ya mapeadas)' })
  async importEmployees(
    @Body() body: { rows: EmployeeImportRow[] },
    @CurrentUser() user: AuthUser,
  ) {
    const organizationId = user.organizationId ?? '';
    return this.importService.importEmployees(organizationId, body.rows || []);
  }

  @Post('companies')
  @Permissions('crm:companies:create')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Importar empresas desde Excel (filas ya mapeadas)' })
  async importCompanies(
    @Body() body: { rows: CompanyImportRow[] },
    @CurrentUser() user: AuthUser,
  ) {
    const organizationId = user.organizationId ?? '';
    return this.importService.importCompanies(organizationId, user.id, body.rows || []);
  }
}
