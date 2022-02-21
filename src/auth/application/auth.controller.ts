import { Body, Controller, Post } from '@nestjs/common';
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
  async signIn(@Body() credentialsDto: CredentialsDto) {
    return await this.authService.signIn(credentialsDto);
  }
}
