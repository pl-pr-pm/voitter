import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

// 対象のテキストを日本語に翻訳する
// sourceの言語はdeepLが自動で識別する
export const translateText = async (targetText: string) => {
  if (!targetText) {
    throw new Error('翻訳対象文章を入力してください');
  }
  try {
    // ダサい。良い方法ないんだっけ・・・。FormData()だと、Bodyが指定された形式と異なってしまい、authkeyが正常に読み込めず403となった
    const body = `auth_key=${process.env.DEEPL_AUTHKEY}&text=${targetText}&target_lang=${process.env.DEEPL_TRANSLATE_TARGET_DEFAULT}`;
    const response = await axios.post(process.env.DEEPL_TRANSLATE_URL, body);
    return response.data.translations[0].text;
  } catch (e) {
    console.log(e.toString());
    throw new Error('翻訳に失敗しました');
  }
};
