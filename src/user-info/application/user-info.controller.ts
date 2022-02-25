import { Controller, Get, Query } from '@nestjs/common';
import { UserInfoService } from '../domain/user-info.service';

@Controller('user-info')
export class UserInfoController {
  constructor(readonly userInfoService: UserInfoService) {}
  @Get()
  async selectTimeline(@Query('username') username: string) {
    return await this.userInfoService.selectUserInfo({ username: username });
  }
}
