import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
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
  @Post('/signup')
  async userSignUp(@Body() credentialsDto: CredentialsDto) {
    return await this.authService.userSignUp(credentialsDto);
  }

  @Post('/system-signup')
  async systemSignUp(@Body() credentialsDto: CredentialsDto) {
    return await this.authService.systemSignUp(credentialsDto);
  }

  @Post('/signin')
  async signIn(
    @Body() credentialsDto: CredentialsDto,
    @Res() response: Response,
  ) {
    const cookie = await this.authService.signIn(credentialsDto);
    response.setHeader('Set-Cookie', cookie);
    return response.send(credentialsDto.username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/signout')
  async signOut(@Body() username: string, @Res() response: Response) {
    await this.authService.signOut(username);
    const cookie = await this.authService.getEmptyCookie();
    response.setHeader('Set-Cookie', cookie);
    return response.send();
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Get('/refresh')
  async refresh(@Req() request: any, @Res() response: Response) {
    const cookie = await this.authService.createCookieWithAccessToken(
      request.user, //JwtRefreshAuthGuard より、requestコンテキストに格納される
    );
    response.setHeader('Set-Cookie', cookie);
    return response.send();
  }

  /**
   * ユーザーが自身で変更できる情報の更新
   */
  @UseGuards(JwtAuthGuard)
  @Post('/update')
  async updateUser(
    @Req() req: any,
    @Body() body: any,
    @Res() response: Response,
  ) {
    const updateContents = {
      username: body.username,
      password: body.password,
      imageUrl: body.imageUrl,
    };

    // 更新対象としてusernameが存在するかどうか
    const updateUsername = body.username ? body.username : req.user.username;

    // Update内容
    const resUpdateContents = await this.authService.updateUser(
      req.user.username,
      updateContents,
    );

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
    ]);

    return response.send(resUpdateContents);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/delete')
  async deleteUser(@Req() req: any, @Res() response: Response) {
    const cookie = await this.authService.deleteUser(req.user.username);
    response.setHeader('Set-Cookie', cookie);
    return response.send();
  }
}
