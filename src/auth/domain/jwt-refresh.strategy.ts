import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../infrastracture/repository/auth.repository';
import { Request } from 'express';
import { AuthService } from './auth.service';

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
      passReqToCallBack: true, // validateメソッドにて、cookieを参照できるようにtrue
    });
    this.reg = new RegExp(/[!"#$%&'()\*\+\-\.,\/:;<=>?@\[\\\]^_`{|}~]/g);
  }
  async validate(request: Request, payload: { username: string }) {
    const { username } = payload;
    try {
      // 記号が含まれているか確認
      // 含まれている場合は、UnauthorizedException を実行
      // Guard デコレータ内で呼ばれるため、バリデーションを実施
      if (this.reg.test(username)) {
        throw new UnauthorizedException();
      }
      const refreshToken = request?.cookies?.AuthneticationRefresh;
      // RefreshトークンがDBに格納されたトークンと比較
      return this.authService.getUserRefreshToken(username, refreshToken);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
