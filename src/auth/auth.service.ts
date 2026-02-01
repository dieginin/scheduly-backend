import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginUserDto, RegisterUserDto, UpdateUserDto } from './dto';
import { compareSync, hashSync } from 'bcrypt';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { isEmail } from 'class-validator';

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

  private async updateUser<T>(id: string, updateData: T) {
    const user = await this.usersRepository.preload({ id, ...updateData });
    if (!user) throw new NotFoundException(`Not user found with ID ${id}`);
    return user;
  }

  async login(loginUserDto: LoginUserDto) {
    const { identifier, password } = loginUserDto;

    const field = isEmail(identifier) ? 'email' : 'username';
    const user = await this.usersRepository.findOne({
      where: { [field]: identifier.toLowerCase() },
      select: { id: true, username: true, email: true, password: true },
    });

    if (!user || !compareSync(password, user.password))
      throw new UnauthorizedException('Invalid credentials');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword; // TODO add token
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
    return userWithoutPassword; // TODO add token
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { email, username } = updateUserDto;
    await this.checkUserExistence(email || '', username || '');

    const user = await this.updateUser(id, updateUserDto);

    await this.usersRepository.save(user);
    return user;
  }

  deactivate(id: string) {
    return { id };
  }

  reactivate(id: string) {
    return { id };
  }
}
