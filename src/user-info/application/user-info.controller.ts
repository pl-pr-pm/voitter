import { Controller, Get, Query } from '@nestjs/common';
import { UserInfoService } from '../domain/user-info.service';
import { validationArg } from '../../util/validateArg';
@Controller('user-info')
export class UserInfoController {
  constructor(readonly userInfoService: UserInfoService) {}
  @Get()
  async selectTimeline(@Query('username') username: string) {
    // TODO: dtoでvalidationを行うようにする。
    validationArg('username', username);
    return await this.userInfoService.selectUserInfo({ username: username });
  }
}
