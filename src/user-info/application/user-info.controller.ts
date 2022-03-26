import { Controller, Get, Query } from '@nestjs/common';
import { UserInfoService } from '../domain/user-info.service';
import { SelectUserInfoDto } from '../interface/dto/select-user-info.dto';
// import { validationArg } from '../../util/validateArg';
@Controller('user-info')
export class UserInfoController {
  constructor(readonly userInfoService: UserInfoService) {}

  /**
   * twitter userの情報を取得する
   * DBに存在しない場合、新規作成する
   * @param username
   * @returns twitter user
   */
  @Get()
  async selectUserInfo(@Query() selectUserInfoDto: SelectUserInfoDto) {
    return await this.userInfoService.selectUserInfo(selectUserInfoDto);
  }
}
