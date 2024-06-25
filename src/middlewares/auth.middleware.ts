import { ExpressRequestInterface } from '@app/types/expressRequest.interface';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';
import { UserService } from '@app/user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    // console.log('auth', req.headers);
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decode: any = verify(token, JWT_SECRET); // обернули в трай/кэтч так как если токен будет не валидным то эта конструкция вывалит нам ошибку
      const user = await this.userService.findById(decode.id);
      req.user = user;
      next(); // без этой команды дальнейшие действия не будут выполняться, поэтому гдето его всетаки нужно писать
    } catch (error) {
      req.user = null;
      next();
    }
  }
}
