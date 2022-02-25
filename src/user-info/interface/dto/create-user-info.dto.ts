import { IsString } from 'class-validator';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserInfoDto {
  @IsNotEmpty()
  @IsString()
  userId: string;
  // twitterの仕様上usernameは、4文字以上50文字以下となる
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(4)
  @IsString()
  username: string;

  @IsString()
  description: string;

  @IsString()
  profile_image_url: string;
}