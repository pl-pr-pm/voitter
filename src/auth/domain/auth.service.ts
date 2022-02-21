import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    });
  }

  async systemSignUp(credentialsDto: CredentialsDto) {
    return await this.userRepository.createUser({
      ...credentialsDto,
      status: UserStatus.SYSTEM,
    });
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
