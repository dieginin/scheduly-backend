import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginUserDto, RegisterUserDto, UpdateUserDto } from './dto';

import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  login(loginUserDto: LoginUserDto) {
    return loginUserDto;
  }

  register(registerUserDto: RegisterUserDto) {
    return registerUserDto;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return { id, updateUserDto };
  }

  deactivate(id: string) {
    return { id };
  }

  reactivate(id: string) {
    return { id };
  }
}
