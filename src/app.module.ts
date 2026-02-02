import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
      synchronize: process.env.NODE_ENV === 'development',
      type: 'postgres',
      username: process.env.DB_USERNAME,
      migrationsRun: process.env.NODE_ENV !== 'development',
      migrations: ['dist/migrations/*.js'],
    }),
    AuthModule,
    CommonModule,
    ReportsModule,
  ],
})
export class AppModule {}
