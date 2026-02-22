import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shift } from '../entities';

@Injectable()
export class ShiftByIdPipe implements PipeTransform<string, Promise<Shift>> {
  constructor(
    @InjectRepository(Shift)
    private readonly shiftsRepository: Repository<Shift>,
  ) {}

  async transform(id: string): Promise<Shift> {
    const shift = await this.shiftsRepository.findOneBy({ id });
    if (!shift) throw new NotFoundException(`Shift ${id} not found`);

    return shift;
  }
}
