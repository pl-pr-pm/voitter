import { Controller, Get, Query } from '@nestjs/common';
import { UserInfoService } from '../domain/user-info.service';
import { SelectUserInfoDto } from '../interface/dto/select-user-info.dto';

@Controller('user-info')
export class UserInfoController {
  constructor(readonly userInfoService: UserInfoService) {}
  @Get()
  async selectTimeline(
    @Query('username') selectUserInfoDto: SelectUserInfoDto,
  ) {
    return await this.userInfoService.selectUserInfo(selectUserInfoDto);
  }
}
