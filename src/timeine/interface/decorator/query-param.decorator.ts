import { SelectTweetDto } from '../dto/select-tweet.dto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const QueryToDto = createParamDecorator(
  (target, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const result = new SelectTweetDto();
    result[target] = request.query[target];
    return result;
  },
);
