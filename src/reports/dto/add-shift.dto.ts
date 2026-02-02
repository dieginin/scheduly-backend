import { IsDateString, ValidateIf } from 'class-validator';

export class AddShiftDto {
  @IsDateString()
  endDate: Date;

  @IsDateString()
  @ValidateIf((x: AddShiftDto) => x.lunchStart !== undefined)
  lunchEnd?: Date;

  @IsDateString()
  @ValidateIf((x: AddShiftDto) => x.lunchEnd !== undefined)
  lunchStart?: Date;

  @IsDateString()
  startDate: Date;
}
