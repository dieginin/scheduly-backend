import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/entities/user.entity';
import { GetUser } from '../common/decorators';
import { CreateReportDto, StartShiftDto } from './dto';
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
  startShift(
    @Param('reportId', ReportByIdPipe) report: Report,
    @Body() startShiftDto: StartShiftDto,
  ) {
    return this.reportsService.startShift(report, startShiftDto);
  }
}
