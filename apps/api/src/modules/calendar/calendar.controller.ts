import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CalendarService } from './calendar.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Calendar')
@ApiBearerAuth()
@Controller('calendar')
@UseGuards(JwtAccessGuard, PermissionsGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('meetings')
  @Permissions('calendar:meetings:read')
  @ApiOperation({ summary: 'Get meetings' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  @ApiQuery({ name: 'search', required: false })
  async findMeetings(
    @CurrentUser('organizationId') organizationId: string,
    @Query('status') status?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('search') search?: string,
  ) {
    return this.calendarService.findMeetings(organizationId, { status, from, to, search });
  }

  @Get('meetings/:id')
  @Permissions('calendar:meetings:read')
  @ApiOperation({ summary: 'Get meeting by ID' })
  async findMeeting(@Param('id') id: string) {
    return this.calendarService.findMeetingById(id);
  }

  @Post('meetings')
  @Permissions('calendar:meetings:create')
  @ApiOperation({ summary: 'Create meeting' })
  async createMeeting(
    @CurrentUser('organizationId') organizationId: string,
    @CurrentUser('id') userId: string,
    @Body() body: { title: string; description?: string; date: string; endDate?: string; location?: string; attendees?: string[] },
  ) {
    return this.calendarService.createMeeting({
      organizationId,
      title: body.title,
      description: body.description,
      date: new Date(body.date),
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      location: body.location,
      organizerId: userId,
      attendees: body.attendees,
    });
  }

  @Put('meetings/:id')
  @Permissions('calendar:meetings:update')
  @ApiOperation({ summary: 'Update meeting' })
  async updateMeeting(
    @Param('id') id: string,
    @Body() body: { title?: string; description?: string; date?: string; endDate?: string; location?: string; status?: string; attendees?: string[] },
  ) {
    return this.calendarService.updateMeeting(id, {
      ...body,
      ...(body.date ? { date: new Date(body.date) } : {}),
      ...(body.endDate ? { endDate: new Date(body.endDate) } : {}),
    });
  }

  @Delete('meetings/:id')
  @Permissions('calendar:meetings:delete')
  @ApiOperation({ summary: 'Delete meeting' })
  async deleteMeeting(@Param('id') id: string) {
    return this.calendarService.deleteMeeting(id);
  }
}
