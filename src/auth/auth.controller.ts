import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './domain/auth.service';
import { CreateUserDto } from './interface/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('singUp')
  async signUp(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return await this.authService.signUp(createUserDto);
  }
}
