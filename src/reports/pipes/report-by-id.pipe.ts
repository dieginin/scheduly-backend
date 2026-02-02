import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '../entities';

@Injectable()
export class ReportByIdPipe implements PipeTransform<string, Promise<Report>> {
  constructor(
    @InjectRepository(Report)
    private readonly reportsRepository: Repository<Report>,
  ) {}

  async transform(id: string): Promise<Report> {
    const report = await this.reportsRepository.findOneBy({ id });
    if (!report) throw new NotFoundException(`Report ${id} not found`);

    return report;
  }
}
