import { TweetV2 } from 'twitter-api-v2/dist/types/v2/tweet.definition.v2';
import { getTweetVoice } from '../util/apis/aws/polly/getTweetVoice';
import { translateTeet } from '../util/apis/deepL/translateTweet';
import { detectionLanguage } from '../util/apis/detectionLanguage/detectionLanguage';
import { getTimeLine } from '../util/apis/twitter/getTimeline';
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
export class TextToVoice {
  constructor(
    private getTweetVoice: TgetTweetVoice,
    private translateTweet: TtranslateTweet,
    private detectionLanguage: TdetectionLanguage,
    private getTimeLine: TgetTimeLine,
  ) {}

  async run(username: string, options: Toptions) {
    // targetのユーザーのタイムラインを取得
    const timeline = await this.getTimeLine(username, 5); // 適当な関数で良い
    const tweetObjWithVoice = await timeline.map(async (tweet) => {
      console.log('tweet', tweet);
      // ツイート分以下ループ
      let voiceTarget = tweet.text;
      let tweetLang = process.env.TWEETVOICE_DEFAULT_LANG;
      if (options.isTranslate) {
        voiceTarget = await this.translateTweet(tweet.text);
      } else {
        // 翻訳しない場合、ツイートの言語は原文の言語となるため、ツイートの言語を識別する
        // ツイートの言語を識別するが、現状pollyでの音声生成は、対象となるマッピングが多いため日本語・英語 発音のみとする
        // 日本語以外のツイートの場合、英語での発音とする
        // 翻訳する場合、日本語とする
        tweetLang = await this.detectionLanguage(tweet.text);
        console.log('tweetLang', tweetLang);
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
        // voiceUrl: 'test',
      };
      return retObj;
    });
    return tweetObjWithVoice;
  }
}

const textToVoice = new TextToVoice(
  getTweetVoice,
  translateTeet,
  detectionLanguage,
  getTimeLine,
);
//
textToVoice
  .run('tweettestaccou4', { isTranslate: false, isMale: true })
  .then((res) => {
    res.map((response) => {
      response.then((secondRes) => console.log(secondRes));
    });
  });
