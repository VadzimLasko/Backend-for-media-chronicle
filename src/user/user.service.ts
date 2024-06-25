import { UpdateUserDto } from './dto/updateUser.dto';
import { UserType } from '@app/user/types/user.type';
import { LoginUserDto } from '@app/user/dto/loginUser.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { UserEntity } from '@app/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';
import { compare } from 'bcrypt';
import { UserResponceInterface } from '@app/user/types/userResponce.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    const userByUserName = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (userByEmail || userByUserName) {
      throw new HttpException(
        'Email or username are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
      select: [
        'id',
        'email',
        'password',
        'username',
        'bio',
        'image',
      ] as (keyof UserType)[],
    });
    if (!user) {
      throw new HttpException(
        'Email or password is wrong',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const userByPassword = user
      ? await compare(loginUserDto.password, user.password)
      : null;
    if (!userByPassword) {
      throw new HttpException(
        'Email or password is wrong',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    if (user && userByPassword) {
      delete user.password;
      return user;
    }
  }

  async updateUser(
    updateUserDto: UpdateUserDto,
    user: UserEntity,
  ): Promise<UserEntity> {
    Object.assign(user, updateUserDto);
    await this.userRepository.update(user.id, user);
    return await this.userRepository.findOneBy({ id: user.id });
  }

  findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id } });
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
    );
  }

  buildUserResponse(user: UserEntity): UserResponceInterface {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}
