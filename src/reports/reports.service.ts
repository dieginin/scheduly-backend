import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { AddShiftDto, CreateReportDto } from './dto';
import { Report, Shift } from './entities';

@Injectable()
export class ReportsService {
  constructor(private readonly dataSource: DataSource) {}

  async create(user: User, createReportDto: CreateReportDto) {
    return this.dataSource.manager.transaction(async (manager) => {
      const count = await manager.count(Report, { where: { user } });
      const number = count + 1;

      const report = manager.create(Report, {
        number,
        user,
        ...createReportDto,
      });
      await manager.save(report);

      const shift = manager.create(Shift, { report, ...createReportDto });
      await manager.save(shift);

      return report;
    });
  }

  async addShift(report: Report, addShiftDto: AddShiftDto) {
    return this.dataSource.manager.transaction(async (manager) => {
      const shift = manager.create(Shift, addShiftDto);
      report.shifts = [...report.shifts, shift];

      await manager.save(report);
      await manager.save(shift);

      return report;
    });
  }
}
