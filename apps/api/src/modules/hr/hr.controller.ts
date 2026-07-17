import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { HrService } from './hr.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('HR')
@ApiBearerAuth()
@Controller('hr')
@UseGuards(JwtAccessGuard, PermissionsGuard)
export class HrController {
  constructor(private readonly hrService: HrService) {}

  private pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    for (const key of keys) {
      if (key in obj) result[key] = obj[key];
    }
    return result;
  }

  // ============================================
  // EMPLOYEES
  // ============================================
  @Get('employees')
  @Permissions('hr:employees:read')
  @ApiOperation({ summary: 'Obtener empleados' })
  @ApiQuery({ name: 'departmentId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findEmployees(@CurrentUser('organizationId') organizationId: string, @Query('departmentId') departmentId?: string, @Query('status') status?: string, @Query('search') search?: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.hrService.findEmployees(organizationId, { departmentId, status, search, page: page ? Number(page) : undefined, limit: limit ? Number(limit) : undefined });
  }

  @Get('employees/:id')
  @Permissions('hr:employees:read')
  @ApiOperation({ summary: 'Obtener empleado por ID' })
  async findEmployeeById(@Param('id') id: string) {
    return this.hrService.findEmployeeById(id);
  }

  @Post('employees')
  @Permissions('hr:employees:create')
  @ApiOperation({ summary: 'Crear empleado' })
  @ApiResponse({ status: 201, description: 'Empleado creado' })
  async createEmployee(@Body() data: any, @CurrentUser('organizationId') organizationId: string) {
    const { organizationId: _, hireDate, salary, departmentId, positionId, branchId, ...body } = data;
    return this.hrService.createEmployee({
      ...body,
      organizationId,
      departmentId: departmentId || undefined,
      positionId: positionId || undefined,
      branchId: branchId || undefined,
      hireDate: hireDate ? new Date(hireDate) : new Date(),
      salary: salary !== undefined && salary !== '' ? BigInt(Math.trunc(Number(salary))) : undefined,
    });
  }

  @Put('employees/:id')
  @Permissions('hr:employees:update')
  @ApiOperation({ summary: 'Actualizar empleado' })
  async updateEmployee(@Param('id') id: string, @Body() data: any) {
    const patch: Record<string, any> = this.pick(data, ['firstName', 'lastName', 'email', 'phone', 'departmentId', 'positionId', 'branchId', 'hireDate', 'salary', 'contractType', 'status']);
    if ('departmentId' in patch) patch.departmentId = patch.departmentId || null;
    if ('positionId' in patch) patch.positionId = patch.positionId || null;
    if ('branchId' in patch) patch.branchId = patch.branchId || null;
    if (patch.hireDate) patch.hireDate = new Date(patch.hireDate);
    if (patch.salary !== undefined && patch.salary !== '') patch.salary = BigInt(Math.trunc(Number(patch.salary)));
    else if (patch.salary === '') delete patch.salary;
    return this.hrService.updateEmployee(id, patch);
  }

  @Delete('employees/:id')
  @Permissions('hr:employees:delete')
  @ApiOperation({ summary: 'Eliminar empleado' })
  async deleteEmployee(@Param('id') id: string) {
    return this.hrService.deleteEmployee(id);
  }

  // ============================================
  // POSITIONS
  // ============================================
  @Get('positions')
  @Permissions('hr:positions:read')
  @ApiOperation({ summary: 'Obtener posiciones' })
  async findPositions(@CurrentUser('organizationId') organizationId: string) {
    return this.hrService.findPositions(organizationId);
  }

  @Get('positions/:id')
  @Permissions('hr:positions:read')
  @ApiOperation({ summary: 'Obtener posicion por ID' })
  async findPositionById(@Param('id') id: string) {
    return this.hrService.findPositionById(id);
  }

  @Post('positions')
  @Permissions('hr:positions:create')
  @ApiOperation({ summary: 'Crear posicion' })
  async createPosition(@Body() data: any, @CurrentUser('organizationId') organizationId: string) {
    const { organizationId: _, ...body } = data;
    return this.hrService.createPosition({ ...body, organizationId });
  }

  @Put('positions/:id')
  @Permissions('hr:positions:update')
  @ApiOperation({ summary: 'Actualizar posicion' })
  async updatePosition(@Param('id') id: string, @Body() data: any) {
    return this.hrService.updatePosition(id, this.pick(data, ['name', 'departmentId']));
  }

  @Delete('positions/:id')
  @Permissions('hr:positions:delete')
  @ApiOperation({ summary: 'Eliminar posicion' })
  async deletePosition(@Param('id') id: string) {
    return this.hrService.deletePosition(id);
  }

  // ============================================
  // ABSENCES
  // ============================================
  @Get('absences')
  @Permissions('hr:absences:read')
  @ApiOperation({ summary: 'Obtener ausencias' })
  @ApiQuery({ name: 'employeeId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAbsences(@CurrentUser('organizationId') organizationId: string, @Query('employeeId') employeeId?: string, @Query('status') status?: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.hrService.findAbsences(organizationId, { employeeId, status, page: page ? Number(page) : undefined, limit: limit ? Number(limit) : undefined });
  }

  @Get('absences/:id')
  @Permissions('hr:absences:read')
  @ApiOperation({ summary: 'Obtener ausencia por ID' })
  async findAbsenceById(@Param('id') id: string) {
    return this.hrService.findAbsenceById(id);
  }

  @Post('absences')
  @Permissions('hr:absences:create')
  @ApiOperation({ summary: 'Crear ausencia' })
  async createAbsence(@Body() data: any) {
    const { organizationId: _, startDate, endDate, reason, notes, ...body } = data;
    return this.hrService.createAbsence({
      ...body,
      notes: notes ?? reason,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : new Date(),
    });
  }

  @Put('absences/:id')
  @Permissions('hr:absences:update')
  @ApiOperation({ summary: 'Actualizar ausencia' })
  async updateAbsence(@Param('id') id: string, @Body() data: any) {
    const patch: Record<string, any> = this.pick(data, ['type', 'startDate', 'endDate', 'notes', 'status']);
    if (data.reason !== undefined && patch.notes === undefined) patch.notes = data.reason;
    if (patch.startDate) patch.startDate = new Date(patch.startDate);
    if (patch.endDate) patch.endDate = new Date(patch.endDate);
    return this.hrService.updateAbsence(id, patch);
  }

  @Delete('absences/:id')
  @Permissions('hr:absences:delete')
  @ApiOperation({ summary: 'Eliminar ausencia' })
  async deleteAbsence(@Param('id') id: string) {
    return this.hrService.deleteAbsence(id);
  }

  // ============================================
  // EVALUATIONS
  // ============================================
  @Get('evaluations')
  @Permissions('hr:evaluations:read')
  @ApiOperation({ summary: 'Obtener evaluaciones' })
  @ApiQuery({ name: 'employeeId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findEvaluations(@CurrentUser('organizationId') organizationId: string, @Query('employeeId') employeeId?: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.hrService.findEvaluations(organizationId, { employeeId, page: page ? Number(page) : undefined, limit: limit ? Number(limit) : undefined });
  }

  @Get('evaluations/:id')
  @Permissions('hr:evaluations:read')
  @ApiOperation({ summary: 'Obtener evaluacion por ID' })
  async findEvaluationById(@Param('id') id: string) {
    return this.hrService.findEvaluationById(id);
  }

  @Post('evaluations')
  @Permissions('hr:evaluations:create')
  @ApiOperation({ summary: 'Crear evaluacion' })
  async createEvaluation(@Body() data: any) {
    const { organizationId: _, selfScore, managerScore, score, comments, notes, period, ...body } = data;
    const resolvedManager = managerScore ?? score;
    return this.hrService.createEvaluation({
      ...body,
      period: period || String(new Date().getFullYear()),
      notes: notes ?? comments,
      selfScore: selfScore !== undefined && selfScore !== '' ? Math.trunc(Number(selfScore)) : undefined,
      managerScore: resolvedManager !== undefined && resolvedManager !== '' ? Math.trunc(Number(resolvedManager)) : undefined,
    });
  }

  @Put('evaluations/:id')
  @Permissions('hr:evaluations:update')
  @ApiOperation({ summary: 'Actualizar evaluacion' })
  async updateEvaluation(@Param('id') id: string, @Body() data: any) {
    const patch: Record<string, any> = this.pick(data, ['period', 'selfScore', 'managerScore', 'notes']);
    if (data.score !== undefined && patch.managerScore === undefined) patch.managerScore = data.score;
    if (data.comments !== undefined && patch.notes === undefined) patch.notes = data.comments;
    if (patch.selfScore !== undefined) patch.selfScore = patch.selfScore === '' ? null : Math.trunc(Number(patch.selfScore));
    if (patch.managerScore !== undefined) patch.managerScore = patch.managerScore === '' ? null : Math.trunc(Number(patch.managerScore));
    return this.hrService.updateEvaluation(id, patch);
  }

  @Delete('evaluations/:id')
  @Permissions('hr:evaluations:delete')
  @ApiOperation({ summary: 'Eliminar evaluacion' })
  async deleteEvaluation(@Param('id') id: string) {
    return this.hrService.deleteEvaluation(id);
  }
}
