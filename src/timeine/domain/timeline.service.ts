import { Injectable } from '@nestjs/common';
import { TextToVoice } from './textToVoice';
import { TweetRepository } from '../infrastracture/repository/tweet.repository';
import { SelectTweetDto } from '../interface/dto/select-tweet.dto';
import { Toptions } from './type/type';
import { TimelineCache } from '../infrastracture/cache/cache';
@Injectable()
export class TimelineService {
  constructor(
    private tweetRepository: TweetRepository,
    private textToVoice: TextToVoice,
    private timelineCache: TimelineCache,
  ) {}

  // タイムライン情報を作成する
  async createTimeline(
    username: string,
    now: string,
    options: any,
    untilId: string,
  ) {
    const query = [];
    const { tweets, oldestId } = await this.textToVoice.run(
      username,
      options,
      untilId,
    );
    for (const tweet of tweets) {
      if (!tweet) {
        continue;
      }
      query.push({
        insertOne: {
          document: {
            tweetId: tweet.tweetId,
            username: username,
            tweetContent: {
              tweetText: tweet.tweetText,
              createdAt: tweet.createdAt,
              voiceUrl: tweet.voiceUrl,
            },
            isTranslate: options.isTranslate,
            createdAt: now,
            updatedAt: now,
          },
        },
      });
    }
    await this.tweetRepository.createBulkTweet(query);
    return;
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
  async selectTimeLine(
    selectTweetDto: SelectTweetDto,
    options: Toptions,
    untilId: string,
  ) {
    const { username } = selectTweetDto;
    const cacheKey = `${username}_${options.isTranslate}_${untilId}`;
    const now = new Date().toISOString();
    // tweetIdにおける検索条件
    const tweetIdCondition = {
      $lt: untilId,
    };
    const timelineFilter =
      untilId === '0000000000'
        ? {
            username: username,
            isTranslate: options.isTranslate,
          }
        : {
            username: username,
            isTranslate: options.isTranslate,
            tweetId: tweetIdCondition,
          };
    // usernameをキーとしたデータがキャッシュにあれば、キャッシュのデータを返却
    const cacheResult = await this.timelineCache.getCache(cacheKey);
    if (cacheResult) return cacheResult;

    // 後続処理の判定のため、対象ユーザーのデータを一件取得する
    const timelines = await this._selectTweet(
      // 翻訳の有無により、タイムライン情報作成処理の実行有無を判定するため、isTranslateを引数に加える
      timelineFilter,
      'createdAt',
      { createdAt: 'desc' },
      1,
    );

    // タイムライン情報が取得できなかった場合
    if (timelines.length === 0) {
      // タイムライン情報を作成する
      await this.createTimeline(username, now, options, untilId);
      // タイムライン情報を取得する
      const timelines = await this._selectTweet(
        timelineFilter,
        'tweetId username tweetContent',
        { tweetId: 'desc' },
        parseInt(process.env.TWEET_MAX_RESULT),
      );
      // }
      await this.timelineCache.deleteCache(cacheKey);
      await this.timelineCache.setCache(cacheKey, timelines);

      return timelines;

      // タイムライン情報が取得できたが、リクエスト処理日とDBへのタイムライン情報登録日に差がない場合、
      // DBからデータを取得し、リターンする
    } else if (
      timelines.length !== 0 &&
      timelines[0]?.createdAt.substring(0, 10) === now.substring(0, 10)
    ) {
      const timelines = await this._selectTweet(
        timelineFilter,
        'tweetId username tweetContent',
        { tweetId: 'desc' },
        parseInt(process.env.TWEET_MAX_RESULT),
      );
      // キャッシュのttlが切れた場合なので、setCacheのみ実施
      await this.timelineCache.setCache(cacheKey, timelines);
      return timelines;
      // リクエスト処理日とDBへのタイムライン情報登録日に差がある場合、タイムライン情報を新規作成し、リターンする
    } else if (
      timelines.length !== 0 &&
      timelines[0]?.createdAt.substring(0, 10) !== now.substring(0, 10)
    ) {
      await this._deleteTimeLine(selectTweetDto);
      await this.createTimeline(username, now, options, untilId);
      const timelines = await this._selectTweet(
        timelineFilter,
        'tweetId username tweetContent',
        { tweetId: 'desc' },
        parseInt(process.env.TWEET_MAX_RESULT),
      );
      await this.timelineCache.deleteCache(cacheKey);
      await this.timelineCache.setCache(cacheKey, timelines);
      return timelines;
    }
  }
}
