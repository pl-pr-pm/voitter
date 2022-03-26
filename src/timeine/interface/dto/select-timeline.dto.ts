import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { UntilIdFormat } from '../validate/select-timeline.validate';
import { UsernameDto } from './username.dto';

export class SelectTimelineDto extends UsernameDto {
  // twitterの仕様上usernameは、4文字以上50文字以下となる
  @IsNotEmpty()
  @MaxLength(25)
  @MinLength(10)
  @IsString()
  @Validate(UntilIdFormat)
  untilId: string;
}
