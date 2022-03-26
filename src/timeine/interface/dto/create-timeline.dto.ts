import { IsNotEmpty, IsBoolean } from 'class-validator';
import { UsernameDto } from './username.dto';

export class CreateTimelineDto extends UsernameDto {
  // twitterの仕様上usernameは、4文字以上50文字以下となる

  @IsNotEmpty()
  @IsBoolean()
  isTranslate: boolean;
}
