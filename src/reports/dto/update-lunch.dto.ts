import { PartialType } from '@nestjs/mapped-types';
import { AddLunchDto } from './add-lunch.dto';

export class UpdateLunchDto extends PartialType(AddLunchDto) {}
