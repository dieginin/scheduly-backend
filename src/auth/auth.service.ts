import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync, hashSync } from 'bcrypt';
import { isEmail } from 'class-validator';
import { Repository } from 'typeorm';
import { LoginUserDto, RegisterUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
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

  private getJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  checkToken(user: User) {
    return { user, token: this.getJwt({ id: user.id }) };
  }

  async login(loginUserDto: LoginUserDto) {
    const { identifier, password } = loginUserDto;

    const field = isEmail(identifier) ? 'email' : 'username';
    const user = await this.usersRepository.findOne({
      where: { [field]: identifier.toLowerCase() },
      select: {
        id: true,
        email: true,
        fullName: true,
        isActive: true,
        password: true,
        roles: true,
        username: true,
      },
    });
    console.log(user);

    if (!user || !compareSync(password, user.password))
      throw new UnauthorizedException('Invalid credentials');
    if (!user.isActive) throw new UnauthorizedException('User is inactive');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userData } = user;
    return { user: userData, token: this.getJwt({ id: user.id }) };
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
    return { user: userWithoutPassword, token: this.getJwt({ id: user.id }) };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    let user: User;
    if (updateUserDto.password) {
      user = await this.updateUser(id, {
        password: hashSync(updateUserDto.password, 10),
      });
    } else {
      const { email, username } = updateUserDto;
      await this.checkUserExistence(email || '', username || '');
      user = await this.updateUser(id, updateUserDto);
    }

    await this.usersRepository.save(user);
    return user;
  }

  async deactivate(id: string) {
    const user = await this.updateUser(id, { isActive: false });
    await this.usersRepository.save(user);
    return user;
  }

  async reactivate(id: string) {
    const user = await this.updateUser(id, { isActive: true });
    await this.usersRepository.save(user);
    return user;
  }
}
