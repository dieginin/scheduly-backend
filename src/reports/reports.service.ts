import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { CreateReportDto } from './dto';
import { Report } from './entities';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  async create(user: User, createReportDto: CreateReportDto) {
    const number = (await this.reportRepository.findBy({ user })).length + 1;
    const report = this.reportRepository.create({
      number,
      user,
      ...createReportDto,
    });
    await this.reportRepository.save(report);
    return report;
  }
}
