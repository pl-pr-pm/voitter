import { IsNotEmpty, IsString } from 'class-validator';
import { TretArray, TbothRetArray } from '../../domain/type/type';
import { UsernameDto } from './username.dto';

export class CreateTweetDto extends UsernameDto {
  // twitterの仕様上usernameは、4文字以上50文字以下となる

  @IsNotEmpty()
  tweetContent: TretArray | TbothRetArray;

  @IsNotEmpty()
  @IsString()
  tweetCreatedAt: string;
}
