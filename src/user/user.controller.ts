import { UserEntity } from '@app/user/user.entity';
import {
  Controller,
  Post,
  Get,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { CreateUserDto } from '@app/user/dto/createUser.dto';

import { UserResponceInterface } from '@app/user/types/userResponce.interface';
import { LoginUserDto } from '@app/user/dto/loginUser.dto';

import { ExpressRequestInterface } from '@app/types/expressRequest.interface';
import { User } from '@app/user/decorators/user.decorator';
import { AuthGuard } from './guards/auth.guard';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {} // через конструктор добавляютя сервисы  \
  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponceInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async loginUser(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<UserResponceInterface> {
    const user = await this.userService.loginUser(loginUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Put('user')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateUser(
    @Body('user') updateUserDto: UpdateUserDto,
    @User() user: UserEntity,
  ): Promise<UserResponceInterface> {
    const updatedUser = await this.userService.updateUser(updateUserDto, user);
    return this.userService.buildUserResponse(updatedUser);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async currentUser(
    @User() user: UserEntity,
    @User('id') id: number,
  ): Promise<UserResponceInterface> {
    return this.userService.buildUserResponse(user);
  }
}
