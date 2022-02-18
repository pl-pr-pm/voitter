import { Injectable } from '@nestjs/common';
import { TextToVoice } from '../domain/textToVoice';
import { TweetRepository } from '../infrastracture/repository/tweet.repository';
import { SelectTweetDto } from '../interface/dto/select-tweet.dto';
import { Toptions } from '../domain/type/type';
@Injectable()
export class CoreService {
  constructor(
    private tweetRepository: TweetRepository,
    private textToVoice: TextToVoice,
  ) {}

  async _createTweet(username: string, options: Toptions) {
    const query = [];
    const now = new Date().toISOString();
    const tweets = await this.textToVoice.run(username, options);
    for (const tweet of tweets) {
      query.push({
        insertOne: {
          document: {
            username: username,
            tweetContent: tweet,
            tweetCreatedAt: tweet.createdAt,
            createdAt: now,
            updatedAt: now,
          },
        },
      });
    }
    this.tweetRepository.createBulkTweet(query);
    return tweets;
  }

  async _selectTweet(selectTweetDto: SelectTweetDto) {
    return await this.tweetRepository.findByUsername(selectTweetDto);
  }

  async selectTimeLine(selectTweetDto: SelectTweetDto, options: Toptions) {
    const { username } = selectTweetDto;
    const timelines = await this._selectTweet({ username: username });
    if (!timelines) {
      this._createTweet(username, options);
    } else if (timelines[0].createdAt) {
    }
  }

  async deleteTimeLine(selectTweetDto: SelectTweetDto): Promise<void> {
    const { username } = selectTweetDto;
  }
}
