import { TweetV2 } from 'twitter-api-v2/dist/types/v2/tweet.definition.v2';

export type TgetTweetVoice = (
  targetText: string,
  isTranslate: boolean,
  isMale: boolean,
  tweetLang: string,
) => Promise<string>;

export type TtranslateTweet = (targetText: string) => Promise<string>;

export type TdetectionLanguage = (targetText: string) => Promise<string>;

export type TgetTimeLine = (
  username: string,
  timeLineMaxResults: number,
) => Promise<TweetV2[]>;

export type Toptions = {
  isTranslate: boolean;
  isMale: boolean;
};

export type TretArray = {
  tweetText: string;
  createdAt: string;
  voiceUrl: string;
};
