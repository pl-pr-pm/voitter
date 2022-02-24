import { IsString } from 'class-validator';
import {
  IsNotEmpty,
  IsNumberString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserInfoDto {
  // twitterの仕様上usernameは、4文字以上50文字以下となる
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(4)
  @IsNumberString()
  username: string;

  @IsString()
  description: string;

  @IsString()
  profile_image_url: string;
}
