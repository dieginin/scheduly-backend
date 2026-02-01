import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/entities/user.entity';
import { GetUser } from '../common/decorators';
import { CreateReportDto } from './dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard())
  create(@GetUser() user: User, @Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(user, createReportDto);
  }
}
