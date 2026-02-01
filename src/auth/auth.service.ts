import { LoginUserDto, RegisterUserDto, UpdateUserDto } from './dto';

import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  login(loginUserDto: LoginUserDto) {
    return loginUserDto;
  }

  register(registerUserDto: RegisterUserDto) {
    return registerUserDto;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return { id, updateUserDto };
  }

  deactivate(id: number) {
    return { id };
  }

  reactivate(id: number) {
    return { id };
  }
}
