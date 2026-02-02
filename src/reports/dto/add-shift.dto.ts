import { IsDateString } from 'class-validator';

export class AddShiftDto {
  @IsDateString()
  startDate: Date;
}
