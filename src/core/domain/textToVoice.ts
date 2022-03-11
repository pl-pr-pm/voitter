import { Logger, Injectable, HttpException } from '@nestjs/common';
import { TweetV2 } from 'twitter-api-v2/dist/types/v2/tweet.definition.v2';
import { GetTweetVoice } from './apis/aws/polly/getTweetVoice';
import { TranslateTweet } from './apis/deepL/translateTweet';
import { DetectionLanguage } from './apis/detectionLanguage/detectionLanguage';
import { GetTimeLine } from './apis/twitter/getTimeline';
import { Toptions, TretArray, TbothRetArray } from './type/type';
import { replaceUrl } from '../../util/replaceUrl';

@Injectable()
export class TextToVoice {
  logger = new Logger(TextToVoice.name);
  constructor(
    private translateTweet: TranslateTweet,
    private detectionLanguage: DetectionLanguage,
    private getTimeLine: GetTimeLine,
    private getTweetVoice: GetTweetVoice,
  ) {}
  // ツイートのオブジェクトを受け取り、音声ファイルを格納したs3のURLを追加し、返却する
  textToVoiceObj = async (tweet: TweetV2, options: Toptions) => {
    let voiceTarget = replaceUrl(tweet.text, ''); //音声化対象ツイートからURLを除外する
    let tweetLang = process.env.DETECTION_NATIVE_LANGUAGE;
    try {
      if (options.isTranslate) {
        voiceTarget = await this.translateTweet.translateTweet(voiceTarget);
      } else {
        // 翻訳しない場合、ツイートの言語は原文の言語となるため、ツイートの言語を識別する
        // ツイートの言語を識別するが、現状pollyでの音声生成は、対象となるマッピングが多いため日本語・英語 発音のみとする
        // 日本語以外のツイートの場合、英語での発音とする
        // 翻訳する場合、日本語とする

        tweetLang = await this.detectionLanguage.detectionLanguage(tweet.text);
      }
      // 男性・女性 両方の声で音声を生成する場合
      if (options.isBoth) {
        const [maleVoiceUrl, femaleVoiceUrl] = await Promise.all([
          this.getTweetVoice.getTweetVoice(
            voiceTarget,
            options.isTranslate,
            (options.isMale = true),
            tweetLang,
          ),
          this.getTweetVoice.getTweetVoice(
            voiceTarget,
            options.isTranslate,
            (options.isMale = false),
            tweetLang,
          ),
        ]);
        const retObj = {
          tweetText: options.isTranslate ? voiceTarget : tweet.text,
          createdAt: tweet.created_at,
          maleVoiceUrl: maleVoiceUrl,
          femaleVoiceUrl: femaleVoiceUrl,
        };
        return retObj;
      } else {
        const voiceUrl = await this.getTweetVoice.getTweetVoice(
          voiceTarget,
          options.isTranslate,
          options.isMale,
          tweetLang,
        );

        const retObj = {
          tweetText: options.isTranslate ? voiceTarget : tweet.text,
          createdAt: tweet.created_at,
          voiceUrl: voiceUrl,
        };
        return retObj;
      }
    } catch (e: any) {
      this.logger.error(`Error発生しました ${e.message}`);
      return;
    }
  };

  async run(username: string, options: Toptions) {
    // targetのユーザーのタイムライン(音声化済み)を取得
    const retArray: (TretArray | TbothRetArray)[] = []; //複数の型を持つ配列の定義方法（ハマる〜）

    try {
      const timeline = await this.getTimeLine.getTimeLine(
        username,
        parseInt(process.env.TWITTER_TWEET_MAX_RESULT),
      );

      for (const tweet of timeline) {
        retArray.push(await this.textToVoiceObj(tweet, options));
      }
      return retArray;
    } catch (e: any) {
      throw new HttpException(
        {
          statusCode: 515,
          message: `対象ユーザーのタイムラインの音声化に失敗しました ${e.message}`,
        },
        515,
      );
    }
  }
}
