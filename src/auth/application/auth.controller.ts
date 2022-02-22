import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../domain/auth.service';
import { CredentialsDto } from '../interface/dto/credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // サインアップ用にユーザ/システムと二つ儲けている
  // ユーザーとシステムのサインアップのエンドポイントが一つであると、システム用の権限がユーザーに割り当てられるなど、システム障害を発生させないため
  // また、エンドポイントごとに、アクセス元を絞ったりしやすいように、エンドポイントを分割している
  @Post('signUp')
  async userSignUp(@Body() credentialsDto: CredentialsDto) {
    return await this.authService.userSignUp(credentialsDto);
  }

  @Post('systemSignUp')
  async systemSignUp(@Body() credentialsDto: CredentialsDto) {
    return await this.authService.systemSignUp(credentialsDto);
  }

  @Post('signIn')
  async signIn(
    @Body() credentialsDto: CredentialsDto,
    @Res() response: Response,
  ) {
    const cookie = await this.authService.signIn(credentialsDto);
    response.setHeader('Set-Cookie', cookie);
    return response.send(credentialsDto.username);
  }
}
