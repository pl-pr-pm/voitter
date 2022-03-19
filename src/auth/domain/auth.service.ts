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
import { S3Upload } from './apis/uploadFileToS3';
import { HttpException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const uuid4 = require('uuid4');

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private s3Upload: S3Upload,
  ) {}

  // ステータスの付与をユーザー/システムで混合しないようロジックを別にしている
  async userSignUp(credentialsDto: CredentialsDto) {
    try {
      return await this.userRepository.createUser({
        ...credentialsDto,
        status: UserStatus.MEMBERS,
        imageUrl: 'default.png',
      });
    } catch (e: any) {
      if (e.message?.includes('E11000')) {
        throw new HttpException(
          {
            statusCode: 530,
            message: `既に登録されているユーザーです。`,
          },
          530,
        );
      }
    }
  }

  async systemSignUp(credentialsDto: CredentialsDto) {
    try {
      return await this.userRepository.createUser({
        ...credentialsDto,
        status: UserStatus.SYSTEM,
        imageUrl: 'default.png',
      });
    } catch (e: any) {
      if (e.message?.includes('E11000')) {
        throw new HttpException(
          {
            statusCode: 530,
            message: `既に登録されているユーザーです。`,
          },
          530,
        );
      }
    }
  }

  /**
   * User情報(username password imageUrl) を返却する
   */
  async getUser(username: string) {
    return await this.userRepository.findByOptions(
      { username: username },
      'username password imageUrl',
    );
  }

  /**
   * User情報を更新する
   * - updateContents
   *   更新する内容
   *   e.g. {username: "変更username", image: "変更image"}
   */
  async updateUser(username: string, updateContents: any) {
    let updateVal = {};

    if (updateContents.isImageChange) {
      const bucketName = process.env.AVATAR_BUCKET_NAME;
      const imagename = `${uuid4()}.jpg`; //jpg固定
      await this.s3Upload.upload(
        bucketName,
        imagename,
        'image/jpeg',
        updateContents.image.buffer,
      );
      updateVal = {
        username: username,
        imageUrl: `https://${bucketName}.s3.ap-northeast-1.amazonaws.com/${imagename}`,
      };
    } else {
      updateVal = {
        username: username,
      };
    }
    await this.userRepository.updateByOptions(
      { username: username },
      { $set: updateVal },
    );
    return updateVal;
  }

  // Accessトークン作成
  async createCookieWithAccessToken(username: string) {
    const payload = { username: username };
    const jwtAccessToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: parseInt(process.env.JWT_EXPIRATION),
    }); // 署名トークンの発行
    return `Authentication=${jwtAccessToken}; HttpOnly; Max-Age=${process.env.JWT_EXPIRATION}; Path=/;  SameSite=None; Secure;`;
  }

  // Refreshトークン作成
  async createCookieWithRefreshToken(username: string) {
    const payload = { username: username };
    const jwtRefreshToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET_KEY,
      expiresIn: parseInt(process.env.JWT_REFRESH_EXPIRATION),
    }); // 署名トークンの発行
    const cookieWithRefreshToken = `AuthneticationRefresh=${jwtRefreshToken}; HttpOnly; Max-Age=${process.env.JWT_REFRESH_EXPIRATION}; Path=/; SameSite=None; Secure;`;

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
    const user = await this.userRepository.findByOptions(
      { username: username },
      'username refreshToken',
    );
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
    await this.userRepository.updateByOptions(
      { username: username },
      {
        $set: { refreshToken: '' },
      },
    );
  }

  async deleteUser(username: string) {
    await this.userRepository.deleteByOptions({ username: username });
    const emptyCookie = this.getEmptyCookie();
    return emptyCookie;
  }
}
