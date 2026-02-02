import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { CreateReportDto, StartShiftDto } from './dto';
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

  async startShift(report: Report, startShiftDto: StartShiftDto) {
    return this.dataSource.manager.transaction(async (manager) => {
      // if (!report.shifts.at(-1)!.endDate)
      //   throw new BadRequestException(
      //     'Cannot add new shift to report with an open shift',
      //   );

      const shift = manager.create(Shift, startShiftDto);
      report.shifts = [...report.shifts, shift];

      await manager.save(report);
      await manager.save(shift);

      return report;
    });
  }
}
