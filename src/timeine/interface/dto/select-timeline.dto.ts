import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import {
  UsernameFormat,
  UntilIdFormat,
} from '../validate/select-timeline.validate';

export class SelectTimelineDto {
  // twitterの仕様上usernameは、4文字以上50文字以下となる
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(4)
  @IsString()
  @Validate(UsernameFormat)
  username: string;

  @IsNotEmpty()
  @MaxLength(25)
  @MinLength(10)
  @IsString()
  @Validate(UntilIdFormat)
  untilId: string;
}
