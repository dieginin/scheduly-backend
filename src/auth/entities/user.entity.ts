import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Report } from '../../reports/entities/report.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  username: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text')
  fullName: string;

  @Column('bool', { default: true })
  isActive: boolean;

  @Column('text', { select: false })
  password: string;

  @Column('text', { array: true, default: ['user'] })
  roles: string[];

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @BeforeInsert()
  @BeforeUpdate()
  normalizeFields() {
    this.email = this.email.toLowerCase();
    this.username = this.username.toLowerCase();
  }
}
