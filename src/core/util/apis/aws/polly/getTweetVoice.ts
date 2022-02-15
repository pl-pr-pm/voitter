import { StartSpeechSynthesisTaskCommand } from '@aws-sdk/client-polly';
import { pollyClient } from './libs/pollyClient';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const staticParams = {
  OutputFormat: 'mp3',
  OutputS3BucketName: process.env.TWEETVOICE_MP3_OUTPUT_BUCKET_NAME,
  TextType: 'text',
  SampleRate: process.env.TWEETVOICE_SAMPLERATE,
};
const _createDynamicParams = (
  targetText: string,
  isTranslate: boolean,
  isMale: boolean,
) => {
  const voiceId: string = process.env.TWEETVOICE_GENERATE_JA_MALE_VOICE_ID;
  const languageCode: string = process.env.TWEETVOICE_DEFAULT_LANG;
  // 一旦無効化
  // if (isTranslate) {
  //   if (isMale) {
  //     voiceId = process.env.TWEETVOICE_GENERATE_EN_MALE_VOICE_ID;
  //   } else {
  //     voiceId = process.env.TWEETVOICE_GENERATE_EN_FEMALE_VOICE_ID;
  //   }
  // } else {
  //   if (!isMale) {
  //     voiceId = process.env.TWEETVOICE_GENERATE_JA_FEMALE_VOICE_ID;
  //   }
  // }
  const dynamicParams = {
    VoiceId: voiceId,
    SampleRate: process.env.TWEETVOICE_SAMPLERATE,
    LanguageCode: languageCode,
    Text: targetText,
  };
  return dynamicParams;
};
// mp3ファイルのURLを取得する
export const getTweetVoice = async (
  targetText: string,
  isTranslate: boolean,
  isMale: boolean,
) => {
  try {
    if (!targetText) {
      throw new Error('音声化対象文章を入力してください');
    }
    const dynamicParams = _createDynamicParams(targetText, false, false);
    const params = { ...staticParams, ...dynamicParams };
    const data = await pollyClient.send(
      new StartSpeechSynthesisTaskCommand(params),
    );
    return data.SynthesisTask.OutputUri;
  } catch (err) {
    throw new Error('音声が生成できませんでした');
  }
};
