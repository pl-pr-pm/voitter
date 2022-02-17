import { TweetV2 } from 'twitter-api-v2/dist/types/v2/tweet.definition.v2';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

type TgetTweetVoice = (
  targetText: string,
  isTranslate: boolean,
  isMale: boolean,
  tweetLang: string,
) => Promise<string>;

type TtranslateTweet = (targetText: string) => Promise<string>;

type TdetectionLanguage = (targetText: string) => Promise<string>;

type TgetTimeLine = (
  username: string,
  timeLineMaxResults: number,
) => Promise<TweetV2[]>;

type Toptions = {
  isTranslate: boolean;
  isMale: boolean;
};

type TretArray = {
  tweetText: string;
  createdAt: string;
  voiceUrl: string;
};
export class TextToVoice {
  constructor(
    private getTweetVoice: TgetTweetVoice,
    private translateTweet: TtranslateTweet,
    private detectionLanguage: TdetectionLanguage,
    private getTimeLine: TgetTimeLine,
  ) {}
  // ツイートのオブジェクトを受け取り、音声ファイルを格納したs3のURLを追加し、返却する
  textToVoiceObj = async (tweet: TweetV2, options: Toptions) => {
    let voiceTarget = tweet.text;
    let tweetLang = process.env.TWEETVOICE_DEFAULT_LANG;
    try {
      if (options.isTranslate) {
        voiceTarget = await this.translateTweet(tweet.text);
      } else {
        // 翻訳しない場合、ツイートの言語は原文の言語となるため、ツイートの言語を識別する
        // ツイートの言語を識別するが、現状pollyでの音声生成は、対象となるマッピングが多いため日本語・英語 発音のみとする
        // 日本語以外のツイートの場合、英語での発音とする
        // 翻訳する場合、日本語とする
        tweetLang = await this.detectionLanguage(tweet.text);
      }
      const voiceUrl = await this.getTweetVoice(
        voiceTarget,
        options.isTranslate,
        options.isMale,
        tweetLang,
      );

      const retObj = {
        tweetText: tweet.text,
        createdAt: tweet.created_at,
        voiceUrl: voiceUrl,
      };
      return retObj;
    } catch (e) {
      console.log(`Error発生しました${e.toString()}`);
      return;
    }
  };

  async run(username: string, options: Toptions) {
    // targetのユーザーのタイムライン(音声化済み)を取得
    const retArray: TretArray[] = [];

    try {
      const timeline = await this.getTimeLine(username, 5);
      for (const tweet of timeline) {
        retArray.push(await this.textToVoiceObj(tweet, options));
      }
      return retArray;
    } catch (e) {
      throw new Error(
        `対象のユーザーのタイムラインの取得及び音声化に失敗しました ${e.toString()}`,
      );
    }
  }
}
