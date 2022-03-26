import {
  PasswordFormat,
  VoitterUsernameFormat,
} from '../validate/credentials.validate';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';

export class CredentialsDto {
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
}
