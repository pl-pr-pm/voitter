import { TwitterApi } from 'twitter-api-v2';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.TWITTER_CONSUMER_KEY,
  appSecret: process.env.TWITTER_CONSUMER_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN_KEY,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
}).readOnly.v2;

// UsernameからTimeLineを取得する
const _getTimeLineFromUserId = async (
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
    throw new Error('timeineの取得に失敗しました');
  }
};
// UsernameからUserIdを取得する
const _getUserIdFromUserName = async (username: string) => {
  if (!username) {
    throw new Error('usernameを入力してください');
  }
  try {
    const res = await client.userByUsername(username);
    return res.data.id;
  } catch (e) {
    throw new Error('useridの取得に失敗しました');
  }
};

export const getTimeLine = async (
  username: string,
  timeLineMaxResults: number,
) => {
  const userId = await _getUserIdFromUserName(username);
  const timeLine = await _getTimeLineFromUserId(userId, timeLineMaxResults);
  return timeLine.data;
};
