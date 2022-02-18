import { StartSpeechSynthesisTaskCommand } from '@aws-sdk/client-polly';
import { Injectable } from '@nestjs/common';
import { pollyClient } from './libs/pollyClient';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Injectable()
export class GetTweetVoice {
  staticParams = {
    OutputFormat: 'mp3',
    OutputS3BucketName: process.env.TWEETVOICE_MP3_OUTPUT_BUCKET_NAME,
    TextType: 'text',
    SampleRate: process.env.TWEETVOICE_SAMPLERATE,
  };

  _createDynamicParams = (
    targetText: string,
    isTranslate: boolean,
    isMale: boolean,
    tweetLang: string,
  ) => {
    const languageCode: string =
      tweetLang === process.env.DETECTION_NATIVE_LANGUAGE
        ? process.env.TWEETVOICE_DEFAULT_LANG
        : process.env.TWEETVOICE_TRANSLATE_EN_LANG;

    const choiseVoiceId = (languageCode) => {
      // 単体テスト可能なように関数で切り出す
      // ツイート文章が英語で男性であれば、米国ー男性の声を選択。女性であれば、米国ー女性。
      // 日本語で、女性であれば、日本ー女性の声を選択
      let voiceId = process.env.TWEETVOICE_GENERATE_JA_MALE_VOICE_ID;
      if (languageCode === process.env.TWEETVOICE_TRANSLATE_EN_LANG) {
        if (isMale) {
          voiceId = process.env.TWEETVOICE_GENERATE_EN_MALE_VOICE_ID;
        } else {
          voiceId = process.env.TWEETVOICE_GENERATE_EN_FEMALE_VOICE_ID;
        }
      } else {
        if (!isMale) {
          // 現状では「日本語だったら」
          voiceId = process.env.TWEETVOICE_GENERATE_JA_FEMALE_VOICE_ID;
        }
      }
      return voiceId;
    };

    const voiceId = choiseVoiceId(languageCode);

    const dynamicParams = {
      VoiceId: voiceId,
      SampleRate: process.env.TWEETVOICE_SAMPLERATE,
      LanguageCode: languageCode,
      Text: targetText,
    };
    return dynamicParams;
  };
  // 文章を音声化する(mp3化)
  // mp3ファイルのURLを返却する
  getTweetVoice = async (
    targetText: string,
    isTranslate: boolean,
    isMale: boolean,
    tweetLang: string,
  ) => {
    try {
      if (!targetText) {
        throw new Error(`音声化対象文章を入力してください`);
      }
      const dynamicParams = this._createDynamicParams(
        targetText,
        isTranslate,
        isMale,
        tweetLang,
      );
      const params = { ...this.staticParams, ...dynamicParams };
      const data = await pollyClient.send(
        new StartSpeechSynthesisTaskCommand(params),
      );
      return data.SynthesisTask.OutputUri;
    } catch (err) {
      throw new Error(`音声が生成できませんでした ${err.toString()}`);
    }
  };
}
