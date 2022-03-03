import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
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
      imageUrl: 'default.png',
    });
  }

  async systemSignUp(credentialsDto: CredentialsDto) {
    return await this.userRepository.createUser({
      ...credentialsDto,
      status: UserStatus.SYSTEM,
      imageUrl: 'default.png',
    });
  }

  /**
   * User情報(username password status imageUrl) を返却する
   */
  async getUser(username: string) {
    return await this.userRepository.findByOptions(
      { username: username },
      'username password status imageUrl',
    );
  }

  /**
   * User情報を更新する
   * - updateContents
   *   更新する内容
   *   e.g. {username: "変更username", imageUrl: "変更imageUrl"}
   */
  async updateUser(username: string, updateContents: any) {
    const result = await this.userRepository.updateByOptions(
      { username: username },
      { $set: updateContents },
    );
    if (result[0]?.username) {
      return result[0].username;
    }
  }

  // Accessトークン作成
  async createCookieWithAccessToken(username: string) {
    const payload = { username: username };
    const jwtAccessToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: parseInt(process.env.JWT_EXPIRATION),
    }); // 署名トークンの発行
    return `Authentication=${jwtAccessToken}; HttpOnly; Max-Age=${process.env.JWT_EXPIRATION}; Path=/;`;
  }

  // Refreshトークン作成
  async createCookieWithRefreshToken(username: string) {
    const payload = { username: username };
    const jwtRefreshToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET_KEY,
      expiresIn: parseInt(process.env.JWT_REFRESH_EXPIRATION),
    }); // 署名トークンの発行
    const cookieWithRefreshToken = `AuthneticationRefresh=${jwtRefreshToken}; HttpOnly; Max-Age=${process.env.JWT_REFRESH_EXPIRATION}; Path=/;`;
    return {
      jwtRefreshToken,
      cookieWithRefreshToken,
    };
  }
  // RefreshトークンをDBに保存
  async setHashedRefreshToken(username: string, refreshToken: string) {
    const refreshSalt = await bcrypt.genSalt();
    const hasedRefreshToken = await bcrypt.hash(refreshToken, refreshSalt);
    await this.userRepository.updateByOptions(
      { username: username },
      { $set: { refreshToken: hasedRefreshToken } },
    );
  }
  // 空のcookieを返却
  async getEmptyCookie() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'AuthneticationRefresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  // Refreshトークンが、DBに格納されているusernameのRefreshトークンと一致した、ユーザを返却する
  async getUserRefreshToken(username: string, refreshToken: string) {
    console.log('username', username);
    const user = await this.userRepository.findByOptions(
      { username: username },
      'username refreshToken',
    );
    console.log('user', user);
    if (user.length == 0) {
      throw new NotFoundException();
    }

    const isMatchRefreshToken = await bcrypt.compare(
      refreshToken,
      user[0].refreshToken, // hased
    );

    if (isMatchRefreshToken) {
      return user[0].username;
    }
  }
  // Refresh/AccessTokenを払い出す
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
    // パスワード認証が通ったら
    if (user[0] && (await bcrypt.compare(password, user[0]?.password))) {
      // AccessToken, RefreshTokenを払い出す
      const cookieWithAccessToken = await this.createCookieWithAccessToken(
        user[0].username,
      );
      const { jwtRefreshToken, cookieWithRefreshToken } =
        await this.createCookieWithRefreshToken(user[0].username);

      // RefreshTokenをDBに保存
      await this.setHashedRefreshToken(username, jwtRefreshToken);

      // AccessToken,RefreshToken それぞれが格納されているCookieを返却する
      return [cookieWithAccessToken, cookieWithRefreshToken];
    }
    throw new UnauthorizedException(
      'ユーザー名またはパスワードを確認してください',
    );
  }
  async signOut(username: string) {
    await this.userRepository.updateByOptions(username, {
      $set: { refreshToken: '' },
    });
  }
}
