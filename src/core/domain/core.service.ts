import { Injectable } from '@nestjs/common';
import { TextToVoice } from './textToVoice';
import { TweetRepository } from '../infrastracture/repository/tweet.repository';
import { SelectTweetDto } from '../interface/dto/select-tweet.dto';
import { Toptions } from './type/type';
import { CoreCache } from '../infrastracture/cache/cache';
import { UserInfoModule } from '../../user-info/user-info.module';
@Injectable()
export class CoreService {
  constructor(
    private tweetRepository: TweetRepository,
    private textToVoice: TextToVoice,
    private coreCache: CoreCache,
  ) {}

  // タイムライン除法を作成する
  async _createTweet(username: string, now: string, options: any) {
    const query = [];
    const tweets = await this.textToVoice.run(username, options);
    for (const tweet of tweets) {
      query.push({
        insertOne: {
          document: {
            username: username,
            tweetContent: tweet,
            tweetCreatedAt: tweet.createdAt,
            isTranslate: options.isTranslate,
            createdAt: now,
            updatedAt: now,
          },
        },
      });
    }
    this.tweetRepository.createBulkTweet(query);
    // データを新規作成・DBへの格納後のデータを返却するのではなく、DB格納前にデータを返却するので、DBから取得した際のデータ構造と合わせる
    const retTweets = {
      username: username,
      tweetContent: tweets,
    };
    return retTweets;
  }

  // 引数によって動的に取得内容を決定する
  // filter: filter要素
  // projections: 取得したい要素
  // sortCondition: sortの条件
  // limitNum: limit件数
  async _selectTweet(
    filter: any,
    projections: any,
    sortCondition: any,
    limitNum: number,
  ) {
    return await this.tweetRepository.findByOptions(filter, projections, {
      sort: sortCondition,
      limit: limitNum,
    });
  }

  // タイムライン情報を削除する
  async _deleteTimeLine(selectTweetDto: SelectTweetDto): Promise<void> {
    await this.tweetRepository.deleteByOptions(selectTweetDto);
    return;
  }

  // タイムライン情報を取得。存在しない場合は、新規作成しDBに登録する
  async selectTimeLine(selectTweetDto: SelectTweetDto, options: Toptions) {
    const { username } = selectTweetDto;
    // usernameをキーとしたデータがキャッシュにあれば、キャッシュのデータを返却
    const cacheResult = await this.coreCache.getCache(username);
    if (cacheResult) return cacheResult;

    const now = new Date().toISOString();
    // 後続処理の判定のため、対象ユーザーのデータを一件取得する
    const timelines = await this._selectTweet(
      // 翻訳の有無により、タイムライン情報作成処理の実行有無を判定するため、isTranslateを引数に加える
      // isTranslate:true のoption の場合であれば、isTranslate:trueの最新作成日を取得する
      { username: username, isTranslate: options.isTranslate },
      'createdAt',
      { createdAt: 'desc' },
      1,
    );
    // タイムライン情報が取得できなかった場合
    if (!timelines) {
      // タイムライン情報を作成する
      const timelines = await this._createTweet(username, now, options);
      await this.coreCache.deleteCache(username);
      await this.coreCache.setCache(username, timelines);
      return timelines;
      // タイムライン情報が取得できたが、リクエスト処理日とDBへのタイムライン情報登録日に差がない場合、
      // DBからデータを取得し、リターンする
    } else if (
      timelines &&
      timelines[0]?.createdAt.substring(0, 10) === now.substring(0, 10)
    ) {
      const timelines = await this._selectTweet(
        { username: username, isTranslate: options.isTranslate },
        'username tweetContent',
        { tweetCreatedAt: 'desc' },
        parseInt(process.env.TWEET_MAX_RESULT),
      );
      // キャッシュのttlが切れた場合なので、setCacheのみ実施
      await this.coreCache.setCache(username, timelines);
      return timelines;
      // リクエスト処理日とDBへのタイムライン情報登録日に差がある場合、タイムライン情報を新規作成し、リターンする
    } else if (
      timelines &&
      timelines[0]?.createdAt.substring(0, 10) !== now.substring(0, 10)
    ) {
      await this._deleteTimeLine(selectTweetDto);
      const timelines = await this._createTweet(username, now, options);
      await this.coreCache.deleteCache(username);
      await this.coreCache.setCache(username, timelines);
      return timelines;
    }
  }
}
