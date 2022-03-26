import { IsString, IsEnum } from 'class-validator';
import { UserStatus } from '../../domain/enum/user-status';

import { CredentialsDto } from './credentials.dto';

export class CreateUserDto extends CredentialsDto {
  @IsEnum(UserStatus)
  status: UserStatus;

  @IsString()
  imageUrl: string;
}
