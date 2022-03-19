import { Injectable } from '@nestjs/common';
import { UserInfoRepository } from '../infrastracture/repository/user-info.repository';
import { SelectUserInfoDto } from '../interface/dto/select-user-info.dto';
import { GetUserInfo } from './apis/twitter/getUserInfo';

@Injectable()
export class UserInfoService {
  constructor(
    private userInfoRepository: UserInfoRepository,
    private getUserInfo: GetUserInfo,
  ) {}

  // ユーザー情報を作成する
  async createUserInfo(username: string) {
    const { userId, description, profile_image_url } =
      await this.getUserInfo.getUserInfoFromUserName(username);
    const userInfo = await this.userInfoRepository.createUserInfo({
      userId,
      username,
      description,
      profile_image_url,
    });
    return userInfo;
  }

  // 引数によって動的に取得内容を決定する
  // filter: filter要素
  // projections: 取得したい要素
  async findUserInfo(filter: any, projections: any) {
    return await this.userInfoRepository.findByOptions(filter, projections);
  }

  // ユーザー情報を削除する
  async deleteUserInfo(username: string): Promise<void> {
    await this.userInfoRepository.deleteByOptions({ username: username });
    return;
  }

  // ユーザー情報を取得。存在しない場合は、新規作成しDBに登録する
  async selectUserInfo(selectUserInfoDto: SelectUserInfoDto) {
    const { username } = selectUserInfoDto;

    const now = new Date().toISOString();

    const userInfo = await this.findUserInfo(
      { username: username },
      'userId username description profile_image_url createdAt updatedAt',
    );
    // ユーザー情報が取得できなかった場合
    // または、
    // リクエスト処理日とDBへのタイムライン情報登録日に差がある場合、タイムライン情報を新規作成し、リターンする
    if (!userInfo) {
      // ユーザー情報を作成する
      const userInfo = await this.createUserInfo(username);
      return userInfo;
      // ユーザー情報が取得でき、リクエスト処理日とDBへのタイムライン情報登録日に差がない場合、
      // DBからデータを取得し、リターンする
    } else if (
      userInfo &&
      userInfo.createdAt.substring(0, 10) === now.substring(0, 10)
    ) {
      return userInfo;
    } else if (
      userInfo &&
      userInfo.createdAt.substring(0, 10) !== now.substring(0, 10)
    ) {
      await this.deleteUserInfo(username);
      const userInfo = await this.createUserInfo(username);
      return userInfo;
    }
  }
}
