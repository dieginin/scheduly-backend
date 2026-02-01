import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Shift } from './shift.entity';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  number: number;

  @Column('date')
  startDate: Date;

  @Column('date', { nullable: true })
  endDate?: Date;

  @ManyToOne(() => User, (user) => user.reports, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Shift, (shift) => shift.report, { eager: true })
  shifts: Shift[];
}
