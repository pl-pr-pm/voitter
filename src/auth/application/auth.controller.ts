import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AuthService } from '../domain/auth.service';
import { JwtAuthGuard } from '../domain/guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from '../domain/guards/jwt-refresh.guard';
import { CredentialsDto } from '../interface/dto/credentials.dto';

/**
 * 本APIの認証にはJWTを利用する
 * JWTは、AccessToken/RefreshTokenの2種類を用意
 * JWTはCookieに格納され、HTTP Onlyとする
 * 通常時、AccessTokenにてAPIの認証を行い、AccessTokenの有効期限が切れた場合、/refresh より、新規のAccessTokenを払い出す
 * RefreshTokenの有効期限が切れた場合、再度/singup を実行
 * RefreshTokenが流出した場合、ユーザーのRefreshTokenを削除する
 */

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // サインアップ用にユーザ/システムと二つ儲けている
  // ユーザーとシステムのサインアップのエンドポイントが一つであると、システム用の権限がユーザーに割り当てられるなど、システム障害を発生させないため
  // また、エンドポイントごとに、アクセス元を絞ったりしやすいように、エンドポイントを分割している

  /**
   * エンドユーザー情報を登録する
   */
  @Post('/signup')
  async userSignUp(@Body() credentialsDto: CredentialsDto) {
    return await this.authService.userSignUp(credentialsDto);
  }
  /**
   * システムユーザー情報を登録する
   */
  @Post('/system-signup')
  async systemSignUp(@Body() credentialsDto: CredentialsDto) {
    return await this.authService.systemSignUp(credentialsDto);
  }

  /**
   * ユーザーを認証しトークンを発行する
   * @param request
   * @param credentialsDto
   * @param response
   * @returns username
   */
  @Post('/signin')
  async signIn(
    @Req() request: any,
    @Body() credentialsDto: CredentialsDto,
    @Res() response: Response,
  ) {
    const cookie = await this.authService.signIn(credentialsDto);
    cookie.push(
      `_csrf=${request.csrfToken()}; Path=/; HttpOnly; SameSite=None; Secure;`,
    );
    response.setHeader('Set-Cookie', cookie);
    return response.send(credentialsDto.username);
  }

  /**
   * 空のトークンを返却する
   * @param request
   * @param response
   */
  @UseGuards(JwtAuthGuard)
  @Put('/signout')
  async signOut(@Req() request: any, @Res() response: Response) {
    const username: string = request.user.username;
    await this.authService.signOut(username);
    const cookie = await this.authService.getEmptyCookie();

    response.setHeader('Set-Cookie', cookie);
    return response.send();
  }

  /**
   * リフレッシュトークンを用いて、アクセストークンを更新する
   * @param request
   * @param response
   * @returns
   */
  @UseGuards(JwtRefreshAuthGuard)
  @Get('/refresh')
  async refresh(@Req() request: any, @Res() response: Response) {
    const cookie = await this.authService.createCookieWithAccessToken(
      request.user, //JwtRefreshAuthGuard より、requestコンテキストに格納される
    );
    response.setHeader(
      'Set-Cookie',
      `${cookie} _csrf=${request.csrfToken()}; Path=/;  SameSite=None; Secure;`,
    );
    return response.send();
  }

  /**
   * ユーザー情報の更新
   * username/ imageを更新対象とする
   * usernmaeを更新した場合、トークンを新規発行する
   */
  @UseGuards(JwtAuthGuard)
  @Put('/user')
  @UseInterceptors(FileInterceptor('img'))
  async updateUser(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
    @Body() body: any,
    @Res() response: Response,
  ) {
    // 更新対象としてusernameが存在するかどうか
    const updateUsername = body.username ? body.username : req.user.username;
    const updateContents = {
      username: updateUsername,
      isUserNameChange: body.username ? true : false,
      image: file,
      isImageChange: body.isImageChange === 'true' ? true : false,
    };
    // Update内容
    const resUpdateContents = await this.authService.updateUser(
      req.user.username,
      updateContents,
    );

    // body.usernameが更新対象としてリクエストされていること
    // かつ
    // body.usernameとJWTのpayloadのusernameが同一でないこと
    if (body.username && !(body.username === req.user.username)) {
      const cookieWithAccessToken =
        await this.authService.createCookieWithAccessToken(updateUsername);
      const { jwtRefreshToken, cookieWithRefreshToken } =
        await this.authService.createCookieWithRefreshToken(updateUsername);

      // RefreshTokenをDBに保存
      await this.authService.setHashedRefreshToken(
        updateUsername,
        jwtRefreshToken,
      );

      response.setHeader('Set-Cookie', [
        cookieWithAccessToken,
        cookieWithRefreshToken,
        `_csrf=${req.csrfToken()}; Path=/;  SameSite=None; Secure;`,
      ]);
    }
    return response.send(resUpdateContents);
  }

  /**
   * ユーザー情報を取得する
   * @param req
   * @returns ユーザー情報
   */
  @UseGuards(JwtAuthGuard)
  @Get('/user')
  async getUser(@Req() req: any) {
    return await this.authService.getUser(req.user.username);
  }

  /**
   * ユーザー情報を削除する
   * @param req
   * @param response
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Delete('/delete')
  async deleteUser(@Req() req: any, @Res() response: Response) {
    const cookie = await this.authService.deleteUser(req.user.username);
    response.setHeader('Set-Cookie', cookie);
    return response.send();
  }
}
