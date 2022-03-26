import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsEnum,
} from 'class-validator';
import { UserStatus } from '../../domain/enum/user-status';
import { Validate } from 'class-validator';
import {
  VoitterUsernameFormat,
  PasswordFormat,
} from '../validate/credentials.validate';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(4)
  @Validate(VoitterUsernameFormat)
  username: string;
  @IsNotEmpty()
  @IsString()
  @MaxLength(16)
  @MinLength(8)
  @Validate(PasswordFormat)
  password: string;

  @IsEnum(UserStatus)
  status: UserStatus;

  @IsString()
  imageUrl: string;
}
