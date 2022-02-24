import { MongooseModule } from '@nestjs/mongoose';
import {
  UserInfo,
  UserInfoSchema,
} from './infrastracture/schema/user-info.scheme';
import { CacheModule, Module } from '@nestjs/common';
import { UserInfoRepository } from './infrastracture/repository/user-info.repository';
import { UserInfoService } from './domain/user-info.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserInfo.name, schema: UserInfoSchema },
    ]),
    CacheModule.register({ ttl: 60, max: 10 }),
  ],
  controllers: [],
  providers: [UserInfoRepository, UserInfoService],
})
export class UserInfoModule {}
