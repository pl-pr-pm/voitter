import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { client } from './libs/twitterClient';

// UsernameからTimeLineを取得する
@Injectable()
export class GetTimeLine {
  _getTimeLineFromUserId = async (
    userId: string,
    timeLineMaxResults: number,
    untilId: string,
  ) => {
    try {
      if (!userId) {
        throw new Error('useridを入力してください');
      }
      let userTimeline;

      // 初回リクエスト or internal用
      if (untilId === '0000000000') {
        userTimeline = await client.userTimeline(userId, {
          exclude: 'replies',
          max_results: timeLineMaxResults,
          'tweet.fields': 'created_at',
        });
      } else {
        userTimeline = await client.userTimeline(userId, {
          exclude: 'replies',
          until_id: untilId,
          max_results: timeLineMaxResults,
          'tweet.fields': 'created_at',
        });
      }
      return userTimeline.data;
    } catch (e: any) {
      throw new HttpException(
        {
          statusCode: 514,
          message: `timelineの取得に失敗しました ${e.message}`,
        },
        514,
      );
    }
  };
  // UsernameからUserInfoを取得する
  _getUserInfoFromUserName = async (username: string) => {
    if (!username) {
      throw new BadRequestException(`usernameを入力してください`);
    }
    try {
      const res = await client.userByUsername(username);
      return res.data.id;
    } catch (e: any) {
      throw new HttpException(
        {
          statusCode: 513,
          message: `useridの取得に失敗しました ${e.message}`,
        },
        513,
      );
    }
  };

  getTimeLine = async (
    username: string,
    timeLineMaxResults: number,
    untilId: string,
  ) => {
    const userId = await this._getUserInfoFromUserName(username);
    const timeLine = await this._getTimeLineFromUserId(
      userId,
      timeLineMaxResults,
      untilId,
    );
    return timeLine;
  };
}
