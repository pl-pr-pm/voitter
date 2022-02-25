import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { client } from './libs/twitterClient';

// UsernameからUserInfoを取得する
@Injectable()
export class GetUserInfo {
  // UsernameからUserInfoを取得する
  getUserInfoFromUserName = async (username: string) => {
    if (!username) {
      throw new BadRequestException(`usernameを入力してください`);
    }
    try {
      const res = await client.userByUsername(username, {
        'user.fields': 'description,profile_image_url',
      });
      return {
        userId: res.data.id,
        description: res.data.description,
        profile_image_url: res.data.profile_image_url,
      };
    } catch (e: any) {
      throw new HttpException(
        {
          statusCode: 516,
          message: `userInfoの取得に失敗しました ${e.message}`,
        },
        516,
      );
    }
  };
}
