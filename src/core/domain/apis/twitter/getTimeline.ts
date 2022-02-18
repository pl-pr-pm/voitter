import { Injectable } from '@nestjs/common';
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
      throw new Error(`timeineの取得に失敗しました  ${e.toString()}`);
    }
  };
  // UsernameからUserIdを取得する
  _getUserIdFromUserName = async (username: string) => {
    if (!username) {
      throw new Error('usernameを入力してください');
    }
    try {
      const res = await client.userByUsername(username);
      return res.data.id;
    } catch (e) {
      throw new Error(`useridの取得に失敗しました ${e.toString()}`);
    }
  };

  getTimeLine = async (username: string, timeLineMaxResults: number) => {
    const userId = await this._getUserIdFromUserName(username);
    const timeLine = await this._getTimeLineFromUserId(
      userId,
      timeLineMaxResults,
    );
    return timeLine.data;
  };
}
