import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../infrastracture/repository/auth.repository';
import { Request } from 'express';

// passport における jwtのストラテジー
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super({
      // Cookie から取得する
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      ignoreExpiration: false, // 有効期限切れをエラーとする
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }
  async validate(payload: { username: string }) {
    const { username } = payload;
    try {
      const user = await this.userRepository.findByOptions(
        { username: username },
        'username',
        { limit: 1 },
      );
      if (user[0]) {
        return user[0];
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
