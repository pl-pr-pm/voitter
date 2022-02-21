import { Injectable } from '@nestjs/common';
import { UserRepository } from '../infrastracture/repository/auth.repository';
import { CreateUserDto } from '../interface/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async signUp(createUserDto: CreateUserDto) {
    return await this.userRepository.createUser(createUserDto);
  }
}
