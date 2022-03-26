import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { HttpException, Injectable } from '@nestjs/common';
import { UserRepository } from '../infrastracture/repository/auth.repository';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { usernameValidation } from 'src/util/validateArg';

// passport における refresh token 用のjwtのストラテジー
@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  private reg: RegExp;
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
  ) {
    super({
      // Cookie から取得する
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.AuthneticationRefresh;
        },
      ]),

      ignoreExpiration: false, // 有効期限切れをエラーとする
      secretOrKey: process.env.JWT_REFRESH_SECRET_KEY,
      passReqToCallback: true, // validateメソッドにて、cookieを参照できるようにtrue
    });
  }
  async validate(req, payload, _) {
    const { username } = payload;
    try {
      // 記号が含まれているか確認
      // 含まれている場合は、UnauthorizedException を実行
      // Guard デコレータ内で呼ばれるため、バリデーションを実施
      if (!username || usernameValidation(username)) {
        throw new HttpException(
          {
            statusCode: 521,
            message: `不適切なusernameです`,
          },
          521,
        );
      }
      const refreshToken = req?.cookies?.AuthneticationRefresh;
      // RefreshトークンがDBに格納されたトークンと比較
      const decodeUsername = await this.authService.getUserRefreshToken(
        username,
        refreshToken,
      );
      return decodeUsername;
    } catch (e: any) {
      throw new HttpException(
        {
          statusCode: 521,
          message: `不適切なusernameです`,
        },
        521,
      );
    }
  }
}
