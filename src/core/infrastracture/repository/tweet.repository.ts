import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tweet, TweetDocument } from '../scheme/tweet.scheme';
import { CreateTweetDto } from './../../interface/dto/create-tweet.dto';
import { SelectTweetDto } from './../../interface/dto/select-tweet.dto';

@Injectable()
export class TweetRepository {
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
    this.tweetModel.bulkWrite(tweetArray); // DBに登録したデータはレスポンス速度を速めるため返却しない。DBとクライアントとで整合性がなくても問題ない。
  }

  // 対象usernameのタイムラインを全件取得
  async findByUsername(selectTweetDto: SelectTweetDto): Promise<Tweet[]> {
    const { username } = selectTweetDto;
    const docs = await this.tweetModel.find({ username: username });
    // return docs.map((doc) => doc.tweetCreatedAt).sort();
    // sort()する
    return docs;
  }

  // 対象のusernameのタイムラインを全件削除
  async deleteByUsername(selectTweetDto: SelectTweetDto): Promise<void> {
    // const { username } = selectTweetDto;
    // this.tweetModel.deleteMany()
  }
}
