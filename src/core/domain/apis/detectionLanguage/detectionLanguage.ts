import { BadRequestException, HttpException, Injectable } from '@nestjs/common';

// 対象の文章の言語を検出する
// もともとは、detection language API (https://detectlanguage.com/) を利用していたが、
// １リクエストあたり約１秒かかっていたため、APIを利用するのをやめ、日本語か英語かのみを正規表現を利用し判定することにした
// 日本語（ひらがな、カタカナ、漢字）が含まれていた場合、日本語と判定。日本語でない場合は英語と判定。
@Injectable()
export class DetectionLanguage {
  isJA = (target: string) => {
    // \u3040-\u309f ひらがな
    // \u30a0-\u30ff カタカナ
    // \u30e0-\u9fcf 漢字
    return target.match(/[\u3040-\u309f\u30a0-\u30ff\u30e0-\u9fcf]+$/)
      ? true
      : false;
  };

  detectionLanguage = async (targetText: string): Promise<string> => {
    let detectionLang = process.env.TWEETVOICE_DEFAULT_LANG;
    if (!targetText) {
      throw new BadRequestException('識別対象文章を確認してください');
    }
    if (!this.isJA(targetText)) {
      detectionLang = process.env.DETECTION_ENGLISH_LANGUAGE;
    }

    return detectionLang;
  };
  catch(e: any) {
    throw new HttpException(
      {
        statusCode: 511,
        message: `文章の言語識別に失敗しました ${e.message()}`,
      },
      511,
    );
  }
}
