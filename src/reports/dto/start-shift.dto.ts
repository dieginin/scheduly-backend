import { IsDateString, ValidateIf } from 'class-validator';

export class StartShiftDto {
  @IsDateString()
  endDate: Date;

  @IsDateString()
  @ValidateIf((x: StartShiftDto) => x.lunchStart !== undefined)
  lunchEnd?: Date;

  @IsDateString()
  @ValidateIf((x: StartShiftDto) => x.lunchEnd !== undefined)
  lunchStart?: Date;

  @IsDateString()
  startDate: Date;
}
