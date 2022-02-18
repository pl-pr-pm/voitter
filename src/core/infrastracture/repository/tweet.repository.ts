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
  async findByUsername(selectTweetDto: SelectTweetDto): Promise<Tweet[]> {
    const { username } = selectTweetDto;
    const docs = await this.tweetModel.find({ username: username });
    // return docs.map((doc) => doc.tweetCreatedAt).sort();
    // sort()する
    return docs;
  }
}
