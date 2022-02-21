import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../infrastracture/repository/auth.repository';
import { CreateUserDto } from '../interface/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { CredentialsDto } from '../interface/dto/credentials.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    return await this.userRepository.createUser(createUserDto);
  }
  async signIn(credentialsDto: CredentialsDto) {
    const { username, password } = credentialsDto;
    const user = await this.userRepository.findByOptions(
      { username: username },
      'createdAt username password',
      null,
    );
    if (user && (await bcrypt.compare(password, user[0].password))) {
      const payload = { username: user[0].username };
      const accessToken = await this.jwtService.sign(payload); // 署名トークンの発行
      return { accessToken };
    }
    throw new UnauthorizedException(
      'ユーザー名またはパスワードを確認してください',
    );
  }
}
