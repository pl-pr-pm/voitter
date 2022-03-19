import { MongooseModule } from '@nestjs/mongoose';
import { Tweet, TweetSchema } from './infrastracture/scheme/tweet.scheme';
import { CacheModule, Module } from '@nestjs/common';
import { TimelineController } from './applicaton/timeline.controller';
import { TimelineService } from './domain/timeline.service';
import { TimelineRepository } from './infrastracture/repository/timeline.repository';
import { GetTweetVoice } from './domain/apis/aws/polly/getTweetVoice';
import { TranslateTweet } from './domain/apis/deepL/translateTweet';
import { DetectionLanguage } from './domain/apis/detectionLanguage/detectionLanguage';
import { GetTimeLine } from './domain/apis/twitter/getTimeline';
import { TextToVoice } from './domain/textToVoice';
import { AuthModule } from 'src/auth/auth.module';
import { TimelineCache } from './infrastracture/cache/cache';
import { UserInfoModule } from 'src/user-info/user-info.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tweet.name, schema: TweetSchema }]),
    AuthModule, // クラスをそれぞれインポートするのではなく、Moduleをインポートすることで、そのModuleでエクスポートしているクラスにのみアクセスできるようになる
    CacheModule.register({ ttl: 60, max: 10 }),
    UserInfoModule,
  ],
  controllers: [TimelineController],
  providers: [
    TimelineService,
    TimelineRepository,
    GetTweetVoice,
    GetTimeLine,
    DetectionLanguage,
    TranslateTweet,
    TextToVoice,
    TimelineCache,
  ],
  exports: [GetTimeLine],
})
export class TimelineModule {}
