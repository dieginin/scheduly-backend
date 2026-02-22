import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/entities/user.entity';
import { GetUser } from '../common/decorators';
import { AddShiftDto, CreateReportDto, UpdateShiftDto } from './dto';
import { Report, Shift } from './entities';
import { ReportByIdPipe, ShiftByIdPipe } from './pipes';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(AuthGuard())
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  getReports(@GetUser() user: User) {
    return this.reportsService.getReports(user);
  }

  @Post()
  create(@GetUser() user: User, @Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(user, createReportDto);
  }

  @Patch(':reportId')
  close(@Param('reportId', ReportByIdPipe) report: Report) {
    return this.reportsService.close(report);
  }

  @Post(':reportId/shifts')
  addShift(
    @Param('reportId', ReportByIdPipe) report: Report,
    @Body() addShiftDto: AddShiftDto,
  ) {
    return this.reportsService.addShift(report, addShiftDto);
  }

  @Patch(':reportId/shifts/:shiftId')
  updateShift(
    @Param('reportId', ReportByIdPipe) report: Report,
    @Param('shiftId', ShiftByIdPipe) shift: Shift,
    @Body() updateShiftDto: UpdateShiftDto,
  ) {
    return this.reportsService.updateShift(report, shift, updateShiftDto);
  }

  @Delete(':reportId/shifts/:shiftId')
  removeShift(
    @Param('reportId', ReportByIdPipe) report: Report,
    @Param('shiftId', ShiftByIdPipe) shift: Shift,
  ) {
    return this.reportsService.removeShift(report, shift);
  }
}
