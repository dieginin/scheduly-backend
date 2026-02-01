import {
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

import { User } from '../entities/user.entity';

export const GetUser = createParamDecorator((data: keyof User, ctx) => {
  const request: Express.Request = ctx.switchToHttp().getRequest();
  const user = request.user as User | undefined;

  if (!user) throw new InternalServerErrorException('User not found (request)');

  return !data ? user : user[data];
});
