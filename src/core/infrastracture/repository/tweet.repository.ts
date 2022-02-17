import { Tweet } from '../../domain/entity/tweet.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTweetDto } from './../../interface/dto/create-tweet.dto';

@EntityRepository(Tweet)
export class TweetRepository extends Repository<Tweet> {
  async createTweet(createTweetDto: CreateTweetDto): Promise<Tweet> {
    const { username, text, tweetCreatedAt } = createTweetDto;

    const tweet = this.create({
      username,
      text,
      tweetCreatedAt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    await this.save(tweet);
    return tweet;
  }
}
