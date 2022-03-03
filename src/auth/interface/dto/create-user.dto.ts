import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsEnum,
} from 'class-validator';
import { UserStatus } from '../../domain/enum/user-status';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(4)
  username: string;
  @IsNotEmpty()
  @IsString()
  @MaxLength(16)
  @MinLength(8)
  password: string;

  @IsEnum(UserStatus)
  status: UserStatus;

  @IsString()
  imageUrl: string;
}
