import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../infrastracture/repository/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { CredentialsDto } from '../interface/dto/credentials.dto';
import * as bcrypt from 'bcrypt';
import { UserStatus } from './enum/user-status';
@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  // ステータスの付与をユーザー/システムで混合しないようロジックを別にしている
  async userSignUp(credentialsDto: CredentialsDto) {
    return await this.userRepository.createUser({
      ...credentialsDto,
      status: UserStatus.MEMBERS,
    });
  }

  async systemSignUp(credentialsDto: CredentialsDto) {
    return await this.userRepository.createUser({
      ...credentialsDto,
      status: UserStatus.SYSTEM,
    });
  }

  // Accessトークン
  async createCookieWithAccessToken(username: string) {
    const payload = { username: username };
    const jwtAccessToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: parseInt(process.env.JWT_EXPIRATION),
    }); // 署名トークンの発行
    return `Authentication=${jwtAccessToken}; HttpOnly; Max-Age=${process.env.JWT_EXPIRATION}; Path=/;`;
  }

  // Refreshトークン
  async createCookieWithRefreshToken(username: string) {
    const payload = { username: username };
    const jwtRefreshToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET_KEY,
      expiresIn: parseInt(process.env.JWT_REFRESH_EXPIRATION),
    }); // 署名トークンの発行
    const cookie = `AuthneticationRrefres=${jwtRefreshToken}; HttpOnly; Max-Age=${process.env.JWT_REFRESH_EXPIRATION}; Path=/;`;
    return {
      jwtRefreshToken,
      cookie,
    };
  }

  async signIn(credentialsDto: CredentialsDto) {
    const { username, password } = credentialsDto;
    const user = await this.userRepository.findByOptions(
      { username: username },
      'createdAt username password',
      null,
    );
    if (user.length === 0)
      throw new UnauthorizedException(
        'ユーザー名またはパスワードを確認してください',
      );
    if (user[0] && (await bcrypt.compare(password, user[0]?.password))) {
      return await this.createCookieWithAccessToken(user[0].username);
    }
    throw new UnauthorizedException(
      'ユーザー名またはパスワードを確認してください',
    );
  }
}
