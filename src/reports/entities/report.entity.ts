import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Shift } from './shift.entity';

@Index(['user', 'number'], { unique: true })
@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  number: number;

  @Column('timestamp')
  startDate: Date;

  @Column('timestamp', { nullable: true })
  endDate?: Date;

  @ManyToOne(() => User, (user) => user.reports, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Shift, (shift) => shift.report, {
    cascade: true,
    eager: true,
  })
  shifts: Shift[];
}
