import { MongooseModule } from '@nestjs/mongoose';
import { Tweet, TweetSchema } from './infrastracture/scheme/tweet.scheme';
import { CacheModule, Module } from '@nestjs/common';
import { CoreController } from './applicaton/core.controller';
import { CoreService } from './domain/core.service';
import { TweetRepository } from './infrastracture/repository/tweet.repository';
import { GetTweetVoice } from './domain/apis/aws/polly/getTweetVoice';
import { TranslateTweet } from './domain/apis/deepL/translateTweet';
import { DetectionLanguage } from './domain/apis/detectionLanguage/detectionLanguage';
import { GetTimeLine } from './domain/apis/twitter/getTimeline';
import { TextToVoice } from './domain/textToVoice';
import { AuthModule } from 'src/auth/auth.module';
import { CoreCache } from './infrastracture/cache/cache';
import { UserInfoModule } from 'src/user-info/user-info.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tweet.name, schema: TweetSchema }]),
    AuthModule, // クラスをそれぞれインポートするのではなく、Moduleをインポートすることで、そのModuleでエクスポートしているクラスにのみアクセスできるようになる
    CacheModule.register({ ttl: 60, max: 10 }),
    UserInfoModule,
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
    CoreCache,
  ],
  exports: [GetTimeLine],
})
export class CoreModule {}
