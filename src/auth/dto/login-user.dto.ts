import { IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @MinLength(1)
  identifier: string;

  @IsString()
  @MinLength(6)
  password: string;
}
