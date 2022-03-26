import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { TretArray, TbothRetArray } from '../../domain/type/type';
import { UsernameFormat } from '../validate/select-timeline.validate';

export class CreateTweetDto {
  // twitterの仕様上usernameは、4文字以上50文字以下となる
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(4)
  @IsString()
  @Validate(UsernameFormat)
  username: string;

  @IsNotEmpty()
  tweetContent: TretArray | TbothRetArray;

  @IsNotEmpty()
  @IsString()
  tweetCreatedAt: string;
}
