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
import { UpdateReportDto } from './dto/update-report.dto';
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

  update(report: Report, updateReportDto: UpdateReportDto) {
    return { report, updateReportDto };
  }

  close(report: Report) {
    return report;
  }

  async addShift(report: Report, addShiftDto: AddShiftDto) {
    return this.dataSource.manager.transaction(async (manager) => {
      //* if (!report.shifts.at(-1)!.endDate)
      //*   throw new BadRequestException(
      //*     'Cannot add new shift to report with an open shift',
      //*   );

      const shift = manager.create(Shift, addShiftDto);
      report.shifts = [...report.shifts, shift];

      await manager.save(report);
      await manager.save(shift);

      return report;
    });
  }

  updateShift(report: Report, shift: Shift, updateShiftDto: UpdateShiftDto) {
    return { shift, updateShiftDtp: updateShiftDto };
  }

  removeShift(report: Report, shift: Shift) {
    return shift;
  }

  addLunch(report: Report, shift: Shift, addLunchDto: AddLunchDto) {
    return { shift, addLunchDto };
  }

  updateLunch(report: Report, shift: Shift, updateLunchDto: UpdateLunchDto) {
    return { shift, updateLunchDto };
  }
}
