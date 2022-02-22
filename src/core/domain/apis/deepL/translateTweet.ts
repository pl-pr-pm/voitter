import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

// 対象のテキストを日本語に翻訳する
// sourceの言語はdeepLが自動で識別する
@Injectable()
export class TranslateTweet {
  translateTweet = async (targetText: string): Promise<string> => {
    if (!targetText) {
      throw new BadRequestException(`翻訳対象文章を入力してください`);
    }
    try {
      // ダサい。良い方法ないんだっけ・・・。FormData()だと、Bodyが指定された形式と異なってしまい、authkeyが正常に読み込めず403となった
      const body = `auth_key=${process.env.DEEPL_AUTHKEY}&text=${targetText}&target_lang=${process.env.DEEPL_TRANSLATE_TARGET_DEFAULT}`;
      const response = await axios.post(process.env.DEEPL_TRANSLATE_URL, body);
      return response.data.translations[0].text;
    } catch (e) {
      throw new HttpException(
        {
          statusCode: 512,
          message: `音声の生成に失敗しました ${e.message()}`,
        },
        512,
      );
    }
  };
}
