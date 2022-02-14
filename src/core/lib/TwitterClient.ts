import { TwitterApi } from 'twitter-api-v2';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

class TwitterClient {
  private client: TwitterApi['readOnly']['v2'];
  private timeLineMaxResults: number;
  constructor(timeLineMaxResults?: number) {
    this.client = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY,
      appSecret: process.env.TWITTER_CONSUMER_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN_KEY,
      accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    }).readOnly.v2;
    this.timeLineMaxResults = timeLineMaxResults || 5;
  }
  // UsernameからTimeLineを取得する
  private async _getTimeLineFromUserId(userId: string) {
    try {
      const userTimeline = await this.client.userTimeline(userId, {
        exclude: 'replies',
        max_results: this.timeLineMaxResults,
        'tweet.fields': 'created_at',
      });
      console.log(userTimeline);
      return userTimeline;
    } catch (e) {
      throw new Error('');
    }
  }
  // UsernameからUserIdを取得する
  private async _getUserIdFromUserName(username: string) {
    if (!username) {
      throw new Error('usernameを入力してください');
    }
    try {
      const res = await this.client.userByUsername(username);
      return res.data.id;
    } catch (e) {
      throw new Error('useridが取得できませんでした。');
    }
  }

  async getTimeLine(username: string) {
    const userId = await this._getUserIdFromUserName(username);
    const timeLine = await this._getTimeLineFromUserId(userId);
    return timeLine;
  }
}
module.exports = new TwitterClient(10).getTimeLine;
