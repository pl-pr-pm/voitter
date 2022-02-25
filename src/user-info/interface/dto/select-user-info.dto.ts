import { IsString } from 'class-validator';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class SelectUserInfoDto {
  // twitterの仕様上usernameは、4文字以上50文字以下となる
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(4)
  @IsString()
  username: string;
}
