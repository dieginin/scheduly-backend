import { IsDateString, IsOptional, ValidateIf } from 'class-validator';

export class AddShiftDto {
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @IsDateString()
  @ValidateIf((x: AddShiftDto) => x.lunchStart !== undefined)
  lunchEnd?: Date;

  @IsDateString()
  @ValidateIf((x: AddShiftDto) => x.lunchEnd !== undefined)
  lunchStart?: Date;

  @IsDateString()
  startDate: Date;
}
