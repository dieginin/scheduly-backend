import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/entities/user.entity';
import { GetUser } from '../common/decorators';
import { AddShiftDto, CreateReportDto } from './dto';
import { Report } from './entities';
import { ReportByIdPipe } from './pipes/report-by-id.pipe';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard())
  create(@GetUser() user: User, @Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(user, createReportDto);
  }

  @Post(':reportId')
  @UseGuards(AuthGuard())
  addShift(
    @Param('reportId', ReportByIdPipe) report: Report,
    @Body() addShiftDto: AddShiftDto,
  ) {
    return this.reportsService.addShift(report, addShiftDto);
  }
}
