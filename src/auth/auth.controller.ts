import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './domain/auth.service';
import { CreateUserDto } from './interface/dto/create-user.dto';
import { CredentialsDto } from './interface/dto/credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signUp')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }
  @Post('signIn')
  async signIn(@Body() credentialsDto: CredentialsDto) {
    console.log(credentialsDto);
    return await this.authService.signIn(credentialsDto);
  }
}
