import { SelectTimelineDto } from '../dto/select-timeline.dto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const QueryToDto = createParamDecorator(
  (target, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const result = new SelectTimelineDto();
    result[target] = request.query[target];
    return result;
  },
);
