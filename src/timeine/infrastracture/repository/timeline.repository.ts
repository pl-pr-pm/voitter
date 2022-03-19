import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tweet, TweetDocument } from '../scheme/tweet.scheme';
import { CreateTweetDto } from '../../interface/dto/create-tweet.dto';

@Injectable()
export class TimelineRepository {
  constructor(
    @InjectModel(Tweet.name) private tweetModel: Model<TweetDocument>,
  ) {}
  // 一件のドキュメントのみ登録
  async createTweet(createTweetDto: CreateTweetDto): Promise<Tweet> {
    const { username, tweetContent, tweetCreatedAt } = createTweetDto;
    const tweet = new this.tweetModel({
      username,
      tweetContent,
      tweetCreatedAt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return tweet.save();
  }

  // 複数件のドキュメントを登録
  async createBulkTweet(tweetArray) {
    await this.tweetModel.bulkWrite(tweetArray);
  }

  // 対象のタイムラインを取得
  async findByOptions(
    filter: any,
    projection: string,
    options: any,
  ): Promise<Tweet[]> {
    const docs = await this.tweetModel.find(filter, projection, options);
    return docs;
  }

  // 対象のタイムラインを削除
  async deleteByOptions(options): Promise<void> {
    this.tweetModel.deleteMany(options);
  }
}
