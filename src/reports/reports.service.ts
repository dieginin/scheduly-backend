import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { CreateReportDto } from './dto';
import { Report, Shift } from './entities';

@Injectable()
export class ReportsService {
  constructor(private readonly dataSource: DataSource) {}

  async create(user: User, createReportDto: CreateReportDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const count = await queryRunner.manager.count(Report, {
        where: { user },
      });
      const number = count + 1;

      const report = queryRunner.manager.create(Report, {
        number,
        user,
        ...createReportDto,
      });
      await queryRunner.manager.save(report);

      const shift = queryRunner.manager.create(Shift, {
        report,
        ...createReportDto,
      });
      await queryRunner.manager.save(shift);

      await queryRunner.commitTransaction();
      return report;
    } catch {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
