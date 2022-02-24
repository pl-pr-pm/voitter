import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { client } from './libs/twitterClient';

// UsernameからTimeLineを取得する
@Injectable()
export class GetTimeLine {
  _getTimeLineFromUserId = async (
    userId: string,
    timeLineMaxResults: number,
  ) => {
    try {
      if (!userId) {
        throw new Error('useridを入力してください');
      }
      const userTimeline = await client.userTimeline(userId, {
        exclude: 'replies',
        max_results: timeLineMaxResults,
        'tweet.fields': 'created_at',
      });
      return userTimeline.data;
    } catch (e) {
      throw new HttpException(
        {
          statusCode: 514,
          message: `timelineの取得に失敗しました ${e.message()}`,
        },
        514,
      );
    }
  };
  // UsernameからUserIdを取得する
  _getUserInfoFromUserName = async (username: string) => {
    if (!username) {
      throw new BadRequestException(`usernameを入力してください`);
    }
    try {
      const res = await client.userByUsername(username, {
        'user.fields': 'description profile_image_url',
      });
      return {
        userId: res.data.id,
        description: res.data.description,
        profile_image_url: res.data.profile_image_url,
      };
    } catch (e) {
      throw new HttpException(
        {
          statusCode: 513,
          message: `useridの取得に失敗しました ${e.message()}`,
        },
        513,
      );
    }
  };

  getTimeLine = async (username: string, timeLineMaxResults: number) => {
    const { userId, description, profile_image_url } =
      await this._getUserInfoFromUserName(username);
    const timeLine = await this._getTimeLineFromUserId(
      userId,
      timeLineMaxResults,
    );
    return {
      timeline: timeLine.data,
      description: description,
      profile_image_url: profile_image_url,
    };
  };
}
