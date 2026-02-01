import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Report } from './report.entity';

@Entity('shifts')
export class Shift {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('date', { nullable: true })
  endDate?: Date;

  @Column('date', { nullable: true })
  lunchEnd?: Date;

  @Column('date', { nullable: true })
  lunchStart?: Date;

  @Column('date')
  startDate: Date;

  @ManyToOne(() => Report, (report) => report.shifts, { onDelete: 'CASCADE' })
  report: Report;
}
