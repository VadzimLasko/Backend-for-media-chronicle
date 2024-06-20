import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { UserResponceInterface } from '@app/user/types/userResponce.interface';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {} // через конструктор добавляютя сервисы  \
  @Post('users')
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponceInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }
}
