import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Calendar')
@ApiBearerAuth()
@Controller('calendar')
@UseGuards(JwtAccessGuard, PermissionsGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('meetings')
  @Permissions('calendar:meetings:read')
  async getMeetings(@CurrentUser('organizationId') organizationId: string) {
    return this.calendarService.findMeetings(organizationId);
  }

  @Post('meetings')
  @Permissions('calendar:meetings:create')
  async createMeeting(
    @CurrentUser('organizationId') organizationId: string,
    @CurrentUser('id') userId: string,
    @Body() body: { title: string; date: string; attendeeIds?: string[] },
  ) {
    return this.calendarService.createMeeting({
      organizationId,
      title: body.title,
      date: new Date(body.date),
      organizerId: userId,
    });
  }

  @Delete('meetings/:id')
  @Permissions('calendar:meetings:delete')
  async deleteMeeting(@Param('id') id: string) {
    return this.calendarService.deleteMeeting(id);
  }
}
