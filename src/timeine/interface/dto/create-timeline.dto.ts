import {
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsBoolean,
  IsString,
  Validate,
} from 'class-validator';
import { UsernameFormat } from '../validate/select-timeline.validate';

export class CreateTimelineDto {
  // twitterの仕様上usernameは、4文字以上50文字以下となる
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(4)
  @IsString()
  @Validate(UsernameFormat)
  username: string;

  @IsNotEmpty()
  @IsBoolean()
  isTranslate: boolean;
}
