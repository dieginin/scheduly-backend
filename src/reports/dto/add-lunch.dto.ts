import { IsDateString } from 'class-validator';

export class AddLunchDto {
  @IsDateString()
  lunchEnd?: Date;

  @IsDateString()
  lunchStart?: Date;
}
