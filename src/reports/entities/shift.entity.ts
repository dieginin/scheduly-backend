import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Report } from './report.entity';

@Entity('shifts')
export class Shift {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('timestamp', { nullable: true })
  endDate?: Date;

  @Column('timestamp', { nullable: true })
  lunchEnd?: Date;

  @Column('timestamp', { nullable: true })
  lunchStart?: Date;

  @Column('timestamp')
  startDate: Date;

  @ManyToOne(() => Report, (report) => report.shifts, { onDelete: 'CASCADE' })
  report: Report;
}
