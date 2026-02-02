import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import {
  AddLunchDto,
  AddShiftDto,
  CreateReportDto,
  UpdateLunchDto,
  UpdateShiftDto,
} from './dto';
import { Report, Shift } from './entities';

@Injectable()
export class ReportsService {
  constructor(private readonly dataSource: DataSource) {}

  create(user: User, createReportDto: CreateReportDto) {
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

      return manager.findOne(Report, { where: { id: report.id } });
    });
  }

  close(report: Report) {
    return report;
  }

  addShift(report: Report, addShiftDto: AddShiftDto) {
    return this.dataSource.manager.transaction(async (manager) => {
      //* if (!report.shifts.at(-1)!.endDate)
      //*   throw new BadRequestException(
      //*     'Cannot add new shift to report with an open shift',
      //*   );

      const shift = manager.create(Shift, { report, ...addShiftDto });
      await manager.save(shift);

      return manager.findOne(Report, { where: { id: report.id } });
    });
  }

  updateShift(report: Report, shift: Shift, updateShiftDto: UpdateShiftDto) {
    return this.dataSource.manager.transaction(async (manager) => {
      manager.merge(Shift, shift, updateShiftDto);
      await manager.save(shift);

      if (updateShiftDto.startDate) {
        const updatedReport = await manager.findOneOrFail(Report, {
          where: { id: report.id },
        });

        const earliestDate = updatedReport.shifts.reduce(
          (earliest, current) =>
            current.startDate < earliest ? current.startDate : earliest,
          updatedReport.shifts[0].startDate,
        );

        if (earliestDate.getTime() !== updatedReport.startDate.getTime()) {
          updatedReport.startDate = earliestDate;
          await manager.save(updatedReport);
        }
      }

      return manager.findOne(Report, { where: { id: report.id } });
    });
  }

  removeShift(report: Report, shift: Shift) {
    return this.dataSource.manager.transaction(async (manager) => {
      await manager.remove(Shift, shift);
      return manager.findOne(Report, { where: { id: report.id } });
    });
  }

  addLunch(report: Report, shift: Shift, addLunchDto: AddLunchDto) {
    return { shift, addLunchDto };
  }

  updateLunch(report: Report, shift: Shift, updateLunchDto: UpdateLunchDto) {
    return { shift, updateLunchDto };
  }
}
