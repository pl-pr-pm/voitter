import { MongooseModule } from '@nestjs/mongoose';
import {
  UserInfo,
  UserInfoSchema,
} from './infrastracture/schema/user-info.scheme';
import { CacheModule, Module } from '@nestjs/common';
import { UserInfoRepository } from './infrastracture/repository/user-info.repository';
import { UserInfoService } from './domain/user-info.service';
import { UserInfoCache } from './infrastracture/cache/cache';
import { UserInfoController } from './application/user-info.controller';
import { GetUserInfo } from './domain/apis/twitter/getUserInfo';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserInfo.name, schema: UserInfoSchema },
    ]),
    CacheModule.register({ ttl: 60, max: 10 }),
  ],
  controllers: [UserInfoController],
  providers: [UserInfoRepository, UserInfoService, UserInfoCache, GetUserInfo],
  exports: [UserInfoService],
})
export class UserInfoModule {}
