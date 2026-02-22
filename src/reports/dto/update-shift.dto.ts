import { PartialType } from '@nestjs/mapped-types';
import { AddShiftDto } from './add-shift.dto';

export class UpdateShiftDto extends PartialType(AddShiftDto) {}
