import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../domain/auth.service';
import { JwtAuthGuard } from '../domain/guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from '../domain/guards/jwt-refresh.guard';
import { CredentialsDto } from '../interface/dto/credentials.dto';

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
      request.user.username,
    );
    response.setHeader('Set-Cookie', cookie);
    return response.send();
  }
}
