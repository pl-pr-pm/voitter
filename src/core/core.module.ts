import { MongooseModule } from '@nestjs/mongoose';
import { Tweet, TweetSchema } from './infrastracture/scheme/tweet.scheme';
import { Module } from '@nestjs/common';
import { CoreController } from './interface/core.controller';
import { CoreService } from './applicaton/core.service';
import { TweetRepository } from './infrastracture/repository/tweet.repository';
import { GetTweetVoice } from './domain/apis/aws/polly/getTweetVoice';
import { TranslateTweet } from './domain/apis/deepL/translateTweet';
import { DetectionLanguage } from './domain/apis/detectionLanguage/detectionLanguage';
import { GetTimeLine } from './domain/apis/twitter/getTimeline';
import { TextToVoice } from './domain/textToVoice';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tweet.name, schema: TweetSchema }]),
  ],
  controllers: [CoreController],
  providers: [
    CoreService,
    TweetRepository,
    GetTweetVoice,
    GetTimeLine,
    DetectionLanguage,
    TranslateTweet,
    TextToVoice,
  ],
})
export class CoreModule {}
