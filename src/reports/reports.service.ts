import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddShiftDto, CreateReportDto, UpdateShiftDto } from './dto';
import { Report, Shift } from './entities';

import { DataSource } from 'typeorm';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ReportsService {
  constructor(private readonly dataSource: DataSource) {}

  private calculateEarliestStartDate(shifts: Shift[]): Date {
    return shifts.reduce(
      (earliest, current) =>
        new Date(current.startDate).getTime() < earliest.getTime()
          ? current.startDate
          : earliest,
      shifts[0].startDate,
    );
  }

  async getReports(user: User) {
    const reports = await this.dataSource.manager.findBy(Report, {
      user: user,
    });
    if (!reports) throw new NotFoundException(`There's not an open reports`);

    return reports;
  }

  create(user: User, createReportDto: CreateReportDto) {
    return this.dataSource.manager.transaction(async (manager) => {
      const count = await manager.count(Report, { where: { user } });
      const number = count + 1;

      const shift = manager.create(Shift, createReportDto);
      const report = manager.create(Report, {
        number,
        user,
        shifts: [shift],
        ...createReportDto,
      });
      await manager.save(report);

      return manager.findOneBy(Report, { id: report.id });
    });
  }

  async close(report: Report) {
    if (report.shifts.find((shift) => !shift.endDate))
      throw new BadRequestException('Cannot close report with open shifts');

    report.endDate = report.shifts.reduce((latest, current) => {
      return current.endDate && current.endDate > latest
        ? current.endDate
        : latest;
    }, new Date());

    await this.dataSource.manager.save(report);
    return report;
  }

  addShift(report: Report, addShiftDto: AddShiftDto) {
    return this.dataSource.manager.transaction(async (manager) => {
      if (report.shifts.find((shift) => !shift.endDate))
        throw new BadRequestException(
          'Cannot add new shift to report with an open shift',
        );

      const shift = manager.create(Shift, { report, ...addShiftDto });
      report.shifts.push(shift);

      report.startDate = this.calculateEarliestStartDate(report.shifts);
      await manager.save(report);

      return manager.findOneBy(Report, { id: report.id });
    });
  }

  updateShift(report: Report, shift: Shift, updateShiftDto: UpdateShiftDto) {
    return this.dataSource.manager.transaction(async (manager) => {
      manager.merge(Shift, shift, updateShiftDto);
      await manager.save(shift);

      if (updateShiftDto.startDate) {
        const updatedReport = await manager.findOneByOrFail(Report, {
          id: report.id,
        });
        updatedReport.startDate = this.calculateEarliestStartDate(
          updatedReport.shifts,
        );
        await manager.save(updatedReport);
      }

      return manager.findOneBy(Report, { id: report.id });
    });
  }

  removeShift(report: Report, shift: Shift) {
    return this.dataSource.manager.transaction(async (manager) => {
      if (report.shifts.length === 1) {
        await manager.remove(Report, report);
        return null;
      }
      await manager.remove(Shift, shift);

      const updatedReport = await manager.findOneByOrFail(Report, {
        id: report.id,
      });
      updatedReport.startDate = this.calculateEarliestStartDate(
        updatedReport.shifts,
      );
      await manager.save(updatedReport);

      return manager.findOneBy(Report, { id: report.id });
    });
  }
}
