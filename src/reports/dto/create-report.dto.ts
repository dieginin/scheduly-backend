import { IsDateString } from 'class-validator';

export class CreateReportDto {
  @IsDateString()
  startDate: Date;
}
