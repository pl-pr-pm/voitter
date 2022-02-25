import { MongooseModule } from '@nestjs/mongoose';
import {
  UserInfo,
  UserInfoSchema,
} from './infrastracture/schema/user-info.scheme';
import { CacheModule, Module } from '@nestjs/common';
import { UserInfoRepository } from './infrastracture/repository/user-info.repository';
import { UserInfoService } from './domain/user-info.service';
import { UserInfoCache } from './infrastracture/cache/cache';
import { CoreModule } from 'src/core/core.module';
import { UserInfoController } from './application/user-info.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserInfo.name, schema: UserInfoSchema },
    ]),
    CacheModule.register({ ttl: 60, max: 10 }),
    CoreModule,
  ],
  controllers: [UserInfoController],
  providers: [UserInfoRepository, UserInfoService, UserInfoCache],
  exports: [UserInfoService],
})
export class UserInfoModule {}
