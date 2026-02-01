import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginUserDto, RegisterUserDto, UpdateUserDto } from './dto';
import { hashSync } from 'bcrypt';
import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private async checkUserExistence(email: string, username: string) {
    if (await this.usersRepository.findOneBy({ email: email.toLowerCase() }))
      throw new ConflictException('An user with this email already exists');
    if (
      await this.usersRepository.findOneBy({ username: username.toLowerCase() })
    )
      throw new ConflictException('An user with this username already exists');
  }

  login(loginUserDto: LoginUserDto) {
    return loginUserDto;
  }

  async register(registerUserDto: RegisterUserDto) {
    const { email, username } = registerUserDto;
    await this.checkUserExistence(email, username);

    const { password, ...userData } = registerUserDto;
    const user = this.usersRepository.create({
      ...userData,
      password: hashSync(password, 10),
    });
    await this.usersRepository.save(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
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
