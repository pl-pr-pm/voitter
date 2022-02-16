import { client } from './lib/detectionLanguageCient';

// 対象の文章の言語を検出する
// 複数の言語が含まれる場合は、それぞれの言語が検出されるが、最もスコアが高いものを文章の言語とする
export const detectionLanguage = async (targetText: string) => {
  if (!targetText) {
    throw new Error('言語検出対象文章を入力してください');
  }
  try {
    const response = await client.detect(targetText);
    const langs = response.filter((lang) => lang.isReliable);
    // 配列が生成されるため、０番目の要素を抽出（要素は一つしかヒットしない）
    const detectionLang = langs[0].language;
    return detectionLang;
  } catch (e) {
    console.log(e.toString());
    throw new Error('言語の検出ができませんでした');
  }
};
