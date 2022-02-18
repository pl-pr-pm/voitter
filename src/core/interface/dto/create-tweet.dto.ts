import { IsString } from 'class-validator';
import {
  IsNotEmpty,
  IsNumberString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TretArray, TbothRetArray } from '../../domain/type/type';

export class CreateTweetDto {
  // twitterの仕様上usernameは、4文字以上50文字以下となる
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(4)
  @IsNumberString()
  username: string;

  @IsNotEmpty()
  tweetContent: TretArray | TbothRetArray;

  @IsNotEmpty()
  @IsString()
  tweetCreatedAt: string;
}
