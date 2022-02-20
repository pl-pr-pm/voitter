import {
  IsNotEmpty,
  IsNumberString,
  MaxLength,
  MinLength,
  IsBoolean,
} from 'class-validator';

export class CreateTimelineDto {
  // twitterの仕様上usernameは、4文字以上50文字以下となる
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(4)
  @IsNumberString()
  username: string;

  @IsNotEmpty()
  @IsBoolean()
  isTranslate: boolean;
}
