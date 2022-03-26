import { IsString, Validate } from 'class-validator';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { UsernameFormat } from '../validate/select-user-info.validate';

export class SelectUserInfoDto {
  // twitterの仕様上usernameは、4文字以上50文字以下となる
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(4)
  @IsString()
  @Validate(UsernameFormat)
  username: string;
}
